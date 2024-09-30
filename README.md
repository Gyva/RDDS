# RDDS
Final year projects management


===================================================

### to install the project in our machine 

1. git clone git@github.com:Gyva/RDDS.git(with ssh)
2. venv/bin/activate(to activate virtual environment)
3. sudo chown -R $USER:$USER /yourPath
4. sudo chmod 755 /yourPath
5. sudo chmod -R u+w /yourpath/RDDS/venv/lib/python3.11/site-packages/
6. sudo chmod -R u+w /yourPath/RDDS/venv/
7. pip install django (if you get an error add use this command "pip install django --break-system-packages")

## Add /home/n0r/.local/bin to your PATH:

1. Open your shell's configuration file (.bashrc, .zshrc, or equivalent). For example:
    `nano ~/.bashrc`
2. Add the following line at the end of the file:
    `export PATH="$HOME/.local/bin:$PATH"`
3. Save the file and exit the editor.
4. Apply the changes:
    `source ~/.bashrc`

## Finaly Runserver

    `python3 manage.py runserver`