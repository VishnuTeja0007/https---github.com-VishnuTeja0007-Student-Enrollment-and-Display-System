//get student list from local storage function when browser loads
window.addEventListener("DOMContentLoaded", () => {
    // Initialize studentList from localStorage or empty array if data not found in local storage
    const storedList = localStorage.getItem("studentDetailsList");
    if (!storedList) {
        localStorage.setItem("studentDetailsList", JSON.stringify([]));
    }
    createAllElements();
});

//createAllElements function to create the divs dynamically when browser loads
function createAllElements(){
    const studentList = JSON.parse(localStorage.getItem("studentDetailsList")) || [];
    if (studentList.length === 0) {
        const displaySection = document.querySelector('.display-section');
        if (displaySection) {
            displaySection.innerHTML = '<p class="text-center text-gray-500">No student records found. Add a new student to get started.</p>';
        }
        return [];
    }
    
    // Clear existing content before repopulating
    const displaySection = document.querySelector('.display-section');
    if (displaySection) {
        displaySection.innerHTML = '';
    }
    
    studentList.forEach(student => createElement(student));
    return studentList;
}

//StudentDetails class and constructor instead of writing each time (easy to cretae when using loops)
class StudentDetails {
    constructor(id, name, dob, email, phone, address) {
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.email = email;
        this.phoneNumber = phone;
        this.address = address;
    }
}

const form = document.querySelector('form');
const studentList = JSON.parse(localStorage.getItem("studentDetailsList")) || [];

//form handlers
const handleSubmit = (e) => {
    e.preventDefault();
    
    // Initialize studentList from localStorage
    let studentList = JSON.parse(localStorage.getItem("studentDetailsList")) || [];
    
    const formData = new FormData(form);
    
    // Get form values
    const id = formData.get('id');
    const name = formData.get('name');
    const dob = formData.get('dob');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const address = formData.get('address');

    // Check if ID already exists (only for new entries)
    const existingStudentIndex = studentList.findIndex(student => student.id === id);
    const isEditing = existingStudentIndex !== -1;

    if (isEditing) {
        // Update existing student
        studentList[existingStudentIndex] = new StudentDetails(id, name, dob, email, phone, address);
    } else {
        // Add new student
        studentList.push(new StudentDetails(id, name, dob, email, phone, address));
    }
    
    // Save back to localStorage
    localStorage.setItem("studentDetailsList", JSON.stringify(studentList));
    
    // Reset form and update display
    form.reset();
    createAllElements();
    
    // Scroll to display section
    const displaySection = document.querySelector(".display-section");
    if (displaySection) {
        displaySection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

form.addEventListener('submit', handleSubmit);

// Function to create and display student element
function createElement(student) {
    const displaySection = document.querySelector('.display-section');
    
    // Create student card
    const studentCard = document.createElement('div');
    studentCard.className = 'student-card bg-white p-4 rounded-lg shadow-md mb-4';
    studentCard.innerHTML = `
        <div class="flex justify-between items-center">
            <h3 class="text-xl font-semibold">${student.name}</h3>
            <div class="flex gap-2">
                <button class="edit-btn px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${student.id}">Edit</button>
                <button class="delete-btn px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${student.id}">Delete</button>
            </div>
        </div>
        <p class="mt-2"><span class="font-semibold">ID:</span> ${student.id}</p>
        <p><span class="font-semibold">DOB:</span> ${student.dob}</p>
        <p><span class="font-semibold">Email:</span> ${student.email}</p>
        <p><span class="font-semibold">Phone:</span> ${student.phoneNumber}</p>
        <p><span class="font-semibold">Address:</span> ${student.address}</p>
    `;
    studentCard.style.overflow="y"
    
    // Add delete functionality
    const deleteBtn = studentCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        const index = studentList.findIndex(s => s.id === student.id);
        if (index > -1) {
            studentList.splice(index, 1);
            localStorage.setItem("studentDetailsList", JSON.stringify(studentList));
            studentCard.remove();
        }
    });
    
    // Add edit functionality
    const editBtn = studentCard.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        // Populate form with student data
        document.getElementById('name').value = student.name;
        document.getElementById('id').value = student.id;
        document.getElementById('dob').value = student.dob;
        document.getElementById('email').value = student.email;
        document.getElementById('phone').value = student.phoneNumber;
        document.getElementById('address').value = student.address;
        
        // Remove the student from the list
        const index = studentList.findIndex(s => s.id === student.id);
        if (index > -1) {
            studentList.splice(index, 1);
            localStorage.setItem("studentDetailsList", JSON.stringify(studentList));
        }
        
        // Remove the card
        studentCard.remove();
    });
    
    displaySection.appendChild(studentCard);
}

const displaySection = document.querySelector('.display-section');
displaySection.style.overflowY="auto"
displaySection.style.maxHeight="400px"

// Reset form
const resetBtn = document.getElementById('reset-form');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        form.reset();
    });
}