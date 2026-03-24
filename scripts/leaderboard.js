const apiUrl = "https://ss-core.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard("all");

  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      filterBtns.forEach((b) => b.classList.remove("active"));

      event.target.classList.add("active");

      const filterValue = event.target.getAttribute("data-filter");
      loadLeaderboard(filterValue);
    });
  });
});

async function loadLeaderboard(filter) {
  const listContainer = document.getElementById("leaderboardList");
  listContainer.innerHTML =
    '<div style="text-align:center; padding: 20px; color: var(--text-muted);">Зареждане на данни...</div>';

  try {
    const response = await fetch(
      `${apiUrl}/api/shifts/leaderboard?filter=${filter}`,
    );
    if (!response.ok) throw new Error("Грешка при връзката със сървъра");

    const data = await response.json();
    renderLeaderboard(data, listContainer);
  } catch (error) {
    console.error("Грешка:", error);
    listContainer.innerHTML =
      '<div style="text-align:center; padding: 20px; color: red;">Възникна грешка при зареждането на класацията.</div>';
  }
}

function renderLeaderboard(data, container) {
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML =
      '<div style="text-align:center; padding: 20px; color: var(--text-muted);">Няма записани дежурства за избрания период.</div>';
    return;
  }

  data.forEach((member, index) => {
    const position = index + 1;

    let rankClass = "standard-rank";
    let badgeContent = position;

    if (position === 1) {
      rankClass = "rank-1";
      badgeContent = "🥇";
    } else if (position === 2) {
      rankClass = "rank-2";
      badgeContent = "🥈";
    } else if (position === 3) {
      rankClass = "rank-3";
      badgeContent = "🥉";
    }

    const html = `
            <div class="board-item ${rankClass}">
                <div class="rank-badge">${badgeContent}</div>
                <div class="member-info">
                    <h3 class="member-name">${member.fullName}</h3>
                    <span class="member-role">Студентски съвет</span>
                </div>
                <div class="score-info">
                    <span class="hours">${member.totalHours}</span>
                    <span class="hours-label">часа</span>
                </div>
            </div>
        `;

    container.insertAdjacentHTML("beforeend", html);
  });
}
