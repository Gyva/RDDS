import spacy
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from nltk import word_tokenize, sent_tokenize
from .models import Project
import torch

# Load an NLP model for Named Entity Recognition (NER)
nlp = spacy.load('en_core_web_lg')

# Use Sentence-BERT for better similarity comparison
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def get_sentence_embeddings(text):
    """
    This function uses Sentence-BERT to convert text into embeddings.
    """
    embeddings = model.encode([text])
    return embeddings.squeeze()

def extract_dynamic_keywords(text):
    """
    This function uses NER and POS tagging to dynamically extract
    important entities, methods, and case studies from the abstract.
    """
    doc = nlp(text)
    improvement_phrases = []
    methods = []
    case_studies = []
    
    for token in doc:
        # Extract dynamic improvement phrases (verbs and adjectives)
        if token.pos_ in ['VERB', 'ADJ'] and token.dep_ == 'ROOT': 
            improvement_phrases.append(token.text.lower())

        # Extract methodology keywords (nouns, proper nouns)
        if token.pos_ in ['NOUN', 'PROPN'] and token.dep_ in ['nsubj', 'dobj']:  # Methods or tools
            methods.append(token.text.lower())

    # Extract named entities for case studies (locations, organizations, etc.)
    for ent in doc.ents:
        if ent.label_ in ['GPE', 'LOC', 'ORG']:  # Geographical locations or organizations
            case_studies.append(ent.text.lower())

    return {
        'improvements': improvement_phrases,
        'methods': methods,
        'case_studies': case_studies
    }

def check_project_uniqueness(title, abstract):
    """
    This function checks if the new project (title, abstract) is similar
    to any existing projects using Sentence-BERT embeddings and dynamic keyword extraction.
    """
    existing_projects = Project.objects.all()

    # Dynamically extract keywords from the new abstract
    new_keywords = extract_dynamic_keywords(abstract)
    
    # Get embeddings for the new project title and abstract
    new_title_embedding = get_sentence_embeddings(title)
    new_abstract_embedding = get_sentence_embeddings(abstract)

    for project in existing_projects:
        # Get embeddings for the existing project title and abstract
        existing_title_embedding = get_sentence_embeddings(project.title)
        existing_abstract_embedding = get_sentence_embeddings(project.abstract)

        # Dynamically extract keywords from the existing project abstract
        existing_keywords = extract_dynamic_keywords(project.abstract)

        # Ensure embeddings are 2D for comparison
        existing_title_embedding = existing_title_embedding.reshape(1, -1)  # Reshape to 2D
        existing_abstract_embedding = existing_abstract_embedding.reshape(1, -1)  # Reshape to 2D
        new_title_embedding = new_title_embedding.reshape(1, -1)  # Reshape to 2D
        new_abstract_embedding = new_abstract_embedding.reshape(1, -1)  # Reshape to 2D

        # Compare embeddings using cosine similarity
        title_similarity = cosine_similarity(existing_title_embedding, new_title_embedding)[0][0]
        abstract_similarity = cosine_similarity(existing_abstract_embedding, new_abstract_embedding)[0][0]

        # Check if titles or abstracts are too similar
        if title_similarity > 0.7 or abstract_similarity > 0.7:
            # Check if there are significant improvements by comparing dynamic keywords
            has_improvement = any(keyword in new_keywords['improvements'] for keyword in existing_keywords['improvements'])
            has_method_similarity = any(keyword in new_keywords['methods'] for keyword in existing_keywords['methods'])
            has_case_study_similarity = any(keyword in new_keywords['case_studies'] for keyword in existing_keywords['case_studies'])

            if has_improvement or has_method_similarity or has_case_study_similarity:
                # If similarity is found, but there is a significant improvement, allow the project to pass
                if abstract_similarity < 0.85:
                    continue
            return False  # Too similar, reject the project

    return True  # No similar project found

#Algorithm for project improvement
def check_improvement_similarity(original_project, improved_title, improved_abstract):
    original_title = original_project.title
    original_abstract = original_project.abstract

    # Ensure the original title and abstract are not None
    if original_title is None or original_abstract is None:
        print("Original project title or abstract is None.")
        return False

    # Convert titles and abstracts into embeddings
    improved_title_embedding = get_sentence_embeddings(improved_title)
    improved_abstract_embedding = get_sentence_embeddings(improved_abstract)
    original_title_embedding = get_sentence_embeddings(original_title)
    original_abstract_embedding = get_sentence_embeddings(original_abstract)

    title_similarity = cosine_similarity([improved_title_embedding], [original_title_embedding])[0][0]
    abstract_similarity = cosine_similarity([improved_abstract_embedding], [original_abstract_embedding])[0][0]

    if title_similarity > 0.85:
        print(f"Title similarity too high: {title_similarity}")
        return False

    if abstract_similarity > 0.75:
        print(f"Abstract similarity too high: {abstract_similarity}")
        return False

    original_sentences = sent_tokenize(original_abstract)
    improved_sentences = sent_tokenize(improved_abstract)

    if len(improved_sentences) <= len(original_sentences):
        print("Improved abstract has no significant structural changes.")
        return False

    original_word_count = len(word_tokenize(original_abstract))
    improved_word_count = len(word_tokenize(improved_abstract))

    if improved_word_count <= original_word_count:
        print("Improved abstract word count is not greater than the original.")
        return False

    print("Project improvement is significant.")
    return True
