const currentDate = new Date().toISOString().split('T')[0];
document.getElementById("dateForSchedule").setAttribute("min", currentDate);


if(document.getElementById("name").value==="Username"){
    alert("Please login...")
}
// Function to decode the token
function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).sub;
}

const token = localStorage.getItem('token');
const username = decodeToken(token);
console.log(username);
const nameToDisplay = document.getElementById("name");
nameToDisplay.textContent = username;

//add a task   
var fetchResult;
document.getElementById("task-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const dateForSchedule = document.getElementById("dateForSchedule").value;
    const taskName = document.getElementById("taskName").value;
    const priority = document.getElementById("choosePriority").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;

    if (endTime <= startTime) {
        const errorMessage = document.getElementById("error-endTime");
        errorMessage.innerHTML = '<p style= "color:red; font-size:12px">' + "End time must be greater than start time" + '</p>';
        return;
    }
    document.getElementById("error-endTime").textContent = "";

    const token = localStorage.getItem("token");
    // console.log(token)
    const myheader = new Headers();
    myheader.append("Content-type", "application/JSON");
    if (token) {
        myheader.append("Authorization", "Bearer " + token);
    }
    const raw = JSON.stringify({
        "dateForSchedule": dateForSchedule,
        "taskName": taskName,
        "priority": priority,
        "startTime": startTime,
        "endTime": endTime
    });
    const requestOptions = {
        method: "POST",
        headers: myheader,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8081/task", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            fetchResult = result;
            if (fetchResult === "Task Added successfully") {
                document.getElementById("dateForSchedule").value = "";
                document.getElementById("taskName").value = "";
                document.getElementById("choosePriority").value = "";
                document.getElementById("start-time").value = "";
                document.getElementById("end-time").value = "";
                alert("Task Added successfully");
            }
            else {
                alert("Task cannot be scheduled because it conflicts with an existing task.");
            }

        })
        .then((error) => console.log())
})




document.addEventListener("DOMContentLoaded", function () {
    var taskFetchFormContainer = document.getElementById("task-fetch-form-container");
    var view = document.getElementById("allTask");
    var addTaskFormContainer = document.getElementById("task");
    var aboutSection = document.getElementById("about");
    var updateSection = document.getElementById("update");
    var loginhead=document.getElementById("logintitle");

    var allViewLink = document.getElementById("view");
    var addTaskLink = document.getElementById("addtask");
    var aboutLink = document.querySelector('a[href="#about"]');
    var viewTaskLink = document.querySelector('a[href="#home"]');
    addTaskLink.addEventListener("click", function (event) {
        event.preventDefault();
        loginhead.style.display="none";
        view.style.display = "none";
        taskFetchFormContainer.style.display = "none";
        addTaskFormContainer.style.display = "block";
        aboutSection.style.display = "none";
        updateSection.style.display = "none";
    });


    aboutLink.addEventListener("click", function (event) {
        event.preventDefault();
        loginhead.style.display="none";
        view.style.display = "none";
        taskFetchFormContainer.style.display = "none";
        addTaskFormContainer.style.display = "none";
        aboutSection.style.display = "block";
        updateSection.style.display = "none";
    });


    viewTaskLink.addEventListener("click", function (event) {
        event.preventDefault();
        loginhead.style.display="none";
        const date = new Date().toISOString().split('T')[0];
        fetchTasks(`http://localhost:8081/task/date/${date}`);
        view.style.display = "none";
        taskFetchFormContainer.style.display = "block";
        addTaskFormContainer.style.display = "none";
        aboutSection.style.display = "none";
        updateSection.style.display = "none";
    });

    allViewLink.addEventListener("click", function (event) {
        event.preventDefault();

        loginhead.style.display="none";
        viewfetchTask();
        view.style.display = "block";
        taskFetchFormContainer.style.display = "none";
        addTaskFormContainer.style.display = "none";
        aboutSection.style.display = "none";
        updateSection.style.display = "none";
    });
});

function viewTaskForUser(){
    document.getElementById("dateForFetch").value="";
    document.getElementById("priority").value="";
    viewfetchTask();
};
async function fetchTasks(apiUrl) {
    const token = localStorage.getItem('token');
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    console.log(tasks)
    const tablerow = document.getElementById("tablerow");
    tablerow.innerHTML = "";
    if (tasks.length === 0) {
        document.getElementById("tablerow").textContent = "No tasks scheduled for today.";
    } else {
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.id = `row_${task.taskId}`;
            row.innerHTML = `
                        <td>${task.dateForSchedule}</td>
                        <td>${task.taskName}</td>
                        <td>${task.priority}</td>
                        <td>${task.startTime}</td>
                        <td>${task.endTime}</td>
                        <td>
                            <button class="oxd-icon-button oxd-table-cell-action-space" type="button" onclick="editTask('${task.taskId}')">
                                <i class="oxd-icon bi-pencil" data-v-bddebfba=""></i>
                            </button>
                            <button class="oxd-icon-button oxd-table-cell-action-space" type="button" onclick="deleteTask('${task.taskId}')">
                                <i class="oxd-icon bi-trash" data-v-bddebfba=""></i>
                            </button>
                        </td>
                    `;
            tablerow.appendChild(row);
        });
    }
}

async function viewfetchTask() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8081/task', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    console.log(tasks)
    const trow = document.getElementById("trow");
    trow.innerHTML = "";
    if (tasks.length === 0) {
        document.getElementById("trow").textContent = 'No tasks found.';
    } else {
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.id = `row_${task.taskId}`;
            row.innerHTML = `
                    <td>${task.dateForSchedule}</td>
                    <td>${task.taskName}</td>
                    <td>${task.priority}</td>
                    <td>${task.startTime}</td>
                    <td>${task.endTime}</td>
                    <td>
                        <button class="oxd-icon-button oxd-table-cell-action-space" type="button" onclick="editTask('${task.taskId}')">
                            <i class="oxd-icon bi-pencil" data-v-bddebfba=""></i>
                        </button>
                        <button class="oxd-icon-button oxd-table-cell-action-space" type="button" onclick="deleteTask('${task.taskId}')">
                            <i class="oxd-icon bi-trash" data-v-bddebfba=""></i>
                        </button>
                    </td>
                `;
            trow.appendChild(row);
        });
    }
}






// delete the task by id
async function deleteTask(taskId) {
    console.log('Task ID:', taskId);
    const token = localStorage.getItem('token');
    console.log(token)

    if (token) {
        const confirmed = confirm("Are you sure you want to delete this task?");
        if (confirmed) {
            try {
                const taskIdInt = parseInt(taskId);
                const apiUrl = `http://localhost:8081/task/${taskId}`;
                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response);

                if (!response.ok) {
                    throw new Error('Failed to delete task');
                }

                // Remove the task row from the UI
                const row = document.getElementById(`row_${taskId}`);
                row.remove();
                return true;
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Error deleting task. Please try again later.');
            }
        }
    }

    else {
        console.error('Token not found in localStorage');
        alert('Token not found in localStorage.');
    }
}


