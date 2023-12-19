var backendUrl = "http://localhost:3000";
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("userInfo");
    window.location.href = "/";
  });
  const profile = document.getElementById("profileImage");
  const panel = document.getElementById("panel");
  profile.addEventListener("click", function () {
    panel.classList.toggle("show");
  });
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const userInfo = {
    token,
  };
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
  // Fetch user profile data
  fetch(backendUrl + "/tasks/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("userInfo")).token
      }`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      // Update profile section with fetched user data
      const profileImage = document.getElementById("profileImage");
      const profileDisplayName = document.getElementById("profileDisplayName");

      profileImage.src = data.picture; // Assuming 'picture' is the URL of the user's image
      profileDisplayName.textContent = data.name; // Assuming 'name' is the user's name
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });

  showTasks();

  const addItemButton = document.getElementById("addItemButton");
  addItemButton.addEventListener("click", () => {
    let taskText = document.getElementById("taskInput").value;

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    fetch(backendUrl + "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        task: taskText,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((task) => {
        console.log("Task added to server:", task);
        document.getElementById("taskInput").value = "";
        showTasks(); // Refresh tasks after adding
      })
      .catch((error) => {
        console.error("There was an error adding the task:", error.message);
      });
  });
});

function showTasks() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  fetch(backendUrl + "/tasks", {
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("userInfo")).token
      }`,
    },
  })
    .then((response) => response.json())
    .then((tasks) => {
      const todoList = document.getElementById("todolist");
      todoList.innerHTML = ""; // Clear existing tasks before adding new ones
      if (tasks.message === "No tasks found for this user") {
      } else {
        tasks.forEach((task) => {
          const c = task.status === "done" ? "checked" : "";
          const item = `
            <li taskId="${task._id}" class="task">
              <input type="checkbox" class="click-check" ${c}>
              <span class="text ${c}">${task.task}</span>
              <i class="fa-solid fa-trash"></i>
            </li>
          `;
          todoList.insertAdjacentHTML("beforeend", item);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
    });
}

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-trash")) {
    const taskItem = event.target.closest(".task");
    if (taskItem) {
      const taskId = taskItem.getAttribute("taskId");
      fetch(backendUrl + `/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Task deleted from server:", data);
          //remove the task from the UI here
          taskItem.classList.add("delete-animation");
          setTimeout(function () {
            taskItem.remove();
          }, 300);
        })
        .catch((error) => {
          console.error("There was an error deleting the task:", error.message);
        });
    }
  }
});

document.addEventListener("change", (event) => {
  if (event.target.classList.contains("click-check")) {
    const taskItem = event.target.closest(".task");
    if (taskItem) {
      const taskId = taskItem.getAttribute("taskid"); // Ensure 'taskid' attribute uses lowercase
      const isChecked = event.target.checked;

      const status = isChecked ? "done" : "todo"; // Determine the status based on checked state

      fetch(backendUrl + `/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
        body: JSON.stringify({
          status,
        }), // Update status based on checked state
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Task status updated:", data);

          // Update UI by adding/removing 'checked' class based on the status
          const textSpan = taskItem.querySelector(".text");
          if (isChecked) {
            textSpan.classList.add("checked"); // Add 'checked' class if the radio button is checked
          } else {
            textSpan.classList.remove("checked"); // Remove 'checked' class if the radio button is unchecked
          }
        })
        .catch((error) => {
          console.error(
            "There was an error updating the task status:",
            error.message
          );
        });
    }
  }
});
