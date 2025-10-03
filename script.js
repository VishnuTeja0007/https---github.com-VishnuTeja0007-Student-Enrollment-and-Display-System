//get student list from local storage function when browser loads
window.addEventListener("DOMContentLoaded", createAllElements);

function createAllElements(){
    const studentList = JSON.parse(localStorage.getItem("studentDetailsList")) || [];
    if(studentList.length === 0){
        return -1;
    }
    else{   
        for (let student of studentList){
            createElement(student);
        }
    }
}

//student object class and constructor
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
    const formData = new FormData(form);
    
    // Get form values
    const id = formData.get('id');
    const name = formData.get('name');
    const dob = formData.get('dob');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const address = formData.get('address');

    // Check if ID already exists
    const idExists = studentList.some(student => student.id === id);
    if (idExists) {
        alert('A student with this ID already exists!');
        return;
    }

    const student = new StudentDetails(id, name, dob, email, phone, address);
    studentList.push(student);
    
    localStorage.setItem("studentDetailsList", JSON.stringify(studentList));
    form.reset();
    createElement(student);
    
    document.querySelector(".display-section").scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
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
resetBtn.addEventListener('click', () => {
    form.reset();
});