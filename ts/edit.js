
// Function to fetch tasks for a specific date and priority
async function fetchTasksForUser(token, date, priority) {
    let apiUrl;
    const encodedPriority = encodeURIComponent(priority);
    if (priority === "All") {
        apiUrl = `http://localhost:8081/task/date/${date}`;
    } else {
        apiUrl = `http://localhost:8081/task/${date}/${encodedPriority}`;
    }

    try {
        console.log(apiUrl)
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }

        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error; 
    }
}

// Event listener for form submission
document.getElementById("task-fetch-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const token2 = localStorage.getItem('token');
    const date = document.getElementById("dateForFetch").value;
    const priority = document.getElementById("priority").value;
    if (token2) {
        try {
            const tasks = await fetchTasksForUser(token2, date, priority);
            const trow = document.getElementById("trow");
             trow.innerHTML = ""; // Clear existing rows before appending new ones
            if (tasks.length === 0) {
               
                document.getElementById("trow").textContent = 'No tasks found for the given criteria.';
            } else {
                tasks.forEach(task => {
                    console.log("Task:", tasks);
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
        } catch (error) {
            console.error('Error fetching tasks:', error);
            document.getElementById("show tasks").textContent = 'Error fetching tasks. Please try again later.';
        }
    } else {
        console.error('Token not found in localStorage');
        document.getElementById("show tasks").textContent = 'Token not found in localStorage.';
    }
});


//edit
let currentTaskId = null;
// Function to handle editing a task
async function editTask(taskId) {
    currentTaskId = taskId;

    var taskFetchFormContainer = document.getElementById("task-fetch-form-container");
    var view = document.getElementById("allTask");
    var addTaskFormContainer = document.getElementById("task");
    var aboutSection = document.getElementById("about");
    var updateSection = document.getElementById("update");

    
        view.style.display="none";
        taskFetchFormContainer.style.display = "none";
        addTaskFormContainer.style.display = "none";
        aboutSection.style.display = "none";
        updateSection.style.display="block";
    


    const token = localStorage.getItem('token');
    if(token){
        const apiUrl = `http://localhost:8081/task/${taskId}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch task details');
            }

            const taskDetails = await response.json();
            console.log(taskDetails)
            // Populate form fields with task details
            document.getElementById("date").value = taskDetails.dateForSchedule;
            document.getElementById("nameTask").value = taskDetails.taskName;
            document.getElementById("priorityOrder").value = taskDetails.priority;
            document.getElementById("starttime").value = taskDetails.startTime;
            document.getElementById("endtime").value = taskDetails.endTime;
        } catch (error) {
            console.error('Error fetching task details:', error);
            // alert('Error fetching task details. Please try again later.');
        }
    } else {
        console.error('Token not found in localStorage');
        // alert('Token not found in localStorage.');
    }

}

    document.getElementById("edit-task-form").addEventListener("submit", async function(event) {
        event.preventDefault();
    
        if (!currentTaskId) {
            console.error('TaskId not found');
            return;
        }
        const dateForSchedule = document.getElementById("date").value;
        const taskName = document.getElementById("nameTask").value;
        const priority = document.getElementById("priorityOrder").value;
        const startTime = document.getElementById("starttime").value;
        const endTime = document.getElementById("endtime").value;
    
        if (endTime <= startTime) {
            const errorMessage = document.getElementById("error-end");
            errorMessage.innerHTML = '<p style= "color:red; font-size:12px">' + "End time must be greater than start time" + '</p>';
            return;
        }
        const token = localStorage.getItem("token");
        const myheader = new Headers();
        myheader.append("Content-type", "application/json");
        if (token) {
            myheader.append("Authorization", "Bearer " + token);
        }
        const raw = JSON.stringify({
            "taskId":currentTaskId,
            "dateForSchedule": dateForSchedule,
            "taskName": taskName,
            "priority": priority,
            "startTime": startTime,
            "endTime": endTime
        });
        let taskId=currentTaskId;
        const apiUrl = `http://localhost:8081/task`;
    
        
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: myheader,
                body: raw,
                redirect: "follow"
            });
    
            if (!response.ok) {
                throw new Error('Failed to update task details');
            }
          
            const result = await response.json();
     
            // Update the task details in the UI
            const row = document.getElementById(`row_${taskId}`);
            row.innerHTML = `
                <td>${result.dateForSchedule}</td>
                <td>${result.taskName}</td>
                <td>${result.priority}</td>
                <td>${result.startTime}</td>
                <td>${result.endTime}</td>
                <td>
                    <button onclick="editTask('${taskId}')">Edit</button>
                    <button onclick="deleteTask('${taskId}')">Delete</button>
                </td>
            `;
    
            alert("Task Updated successfully");
          document.getElementById("date").value="";
         document.getElementById("nameTask").value="";
        document.getElementById("priorityOrder").value="";
        document.getElementById("starttime").value="";
        document.getElementById("endtime").value="";
            
        
    });



var logout = document.querySelector('a[href="#logout"]');
logout.addEventListener("click", function (event) {
    event.preventDefault();
   document.getElementById("name").value="";
   localStorage.removeItem('token');
   localStorage.setItem("isLoggedIn", "false");
   window.location.href = "https://www.google.com";
});