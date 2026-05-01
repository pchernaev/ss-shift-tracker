const apiUrl = "https://ss-core.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  loadMembers();
  setCurrentTimeForEndTime();

  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  hamburgerBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    if (!dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove("show");
    }
  });
});

async function loadMembers() {
  try {
    const response = await fetch(`${apiUrl}/api/shifts/members`);
    if (response.ok) {
      const members = await response.json();
      const select = document.getElementById("studentName");

      select.innerHTML =
        '<option value="" disabled selected>Изберете име...</option>';

      members.forEach((member) => {
        const option = document.createElement("option");
        option.value = member.id;
        option.textContent = member.firstName + " " + member.lastName;
        select.appendChild(option);
      });
    } else {
      console.error("Грешка при зареждане на членовете");
    }
  } catch (error) {
    console.error("Проблем с връзката към сървъра:", error);
  }
}

function setCurrentTimeForEndTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  document.getElementById(
    "endTime"
  ).value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

document
  .getElementById("dutyForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const memberId = document.getElementById("studentName").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const statusMessage = document.getElementById("status-message");

    if (startTime >= endTime) {
      statusMessage.textContent =
        "Началната дата и час трябва да са преди крайните!";
      statusMessage.className = "error";
      return;
    }

    const startDateTime = `${startTime}:00`;
    const endDateTime = `${endTime}:00`;

    try {
      const response = await fetch(`${apiUrl}/api/shifts/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId: parseInt(memberId),
          startTime: startDateTime,
          endTime: endDateTime,
        }),
      });

      if (response.ok) {
        statusMessage.textContent = "Дежурството е записано успешно!";
        statusMessage.className = "success";

        setTimeout(() => {
          document.getElementById("dutyForm").reset();
          setCurrentTimeForEndTime();
          statusMessage.textContent = "";
        }, 2000);
      } else {
        statusMessage.textContent = "Грешка при записване в базата.";
        statusMessage.className = "error";
      }
    } catch (error) {
      statusMessage.textContent = "Няма връзка със сървъра!";
      statusMessage.className = "error";
      console.error(error);
    }
  });
