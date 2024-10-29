export function getAcademicYear() {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const academicYear = `${lastYear}-${currentYear}`;
    return academicYear;
}

console.log(getAcademicYear()); // Example output: "2023-2024"
