// quan li diem====================================================================================================================
document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("student-form");
  const studentTable = document
    .getElementById("student-table")
    .querySelector("tbody");
  const reportContent = document.getElementById("report-content");

  let students = JSON.parse(localStorage.getItem("students")) || [];

  const renderTable = () => {
    studentTable.innerHTML = "";
    students.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${student.name}</td>
              <td>${student.course}</td>
              <td>${student.score}</td>
              <td>
                  <button class="btn btn-warning btn-sm" onclick="editStudent(${index})">Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteStudent(${index})">Xóa</button>
              </td>
          `;
      studentTable.appendChild(row);
    });
  };

  studentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const studentName = document.getElementById("studentName").value.trim();
    const courseName = document.getElementById("courseName").value.trim();
    const studentScore = document.getElementById("studentScore").value.trim();

    if (studentName && studentScore && courseName) {
      const existingIndex = students.findIndex(
        (student) =>
          student.name === studentName && student.course === courseName
      );
      if (existingIndex > -1) {
        students[existingIndex].score = studentScore;
      } else {
        students.push({
          name: studentName,
          score: studentScore,
          course: courseName,
        });
      }

      localStorage.setItem("students", JSON.stringify(students));
      renderTable();
      studentForm.reset();
    }
  });

  window.editStudent = (index) => {
    const student = students[index];
    document.getElementById("studentName").value = student.name;
    document.getElementById("courseName").value = student.course;
    document.getElementById("studentScore").value = student.score;
  };

  window.deleteStudent = (index) => {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderTable();
  };

  //report=====================================================================================
  document.getElementById("generate-report").addEventListener("click", () => {
    reportContent.innerHTML = "";
    const totalScore = students.reduce(
      (acc, student) => acc + parseFloat(student.score),
      0
    );
    const avgScore = students.length > 0 ? totalScore / students.length : 0;
    const reportHTML = `
          <p>Tổng số sinh viên: ${students.length}</p>
          <p>Điểm trung bình: ${avgScore.toFixed(2)}</p>
      `;
    reportContent.innerHTML = reportHTML;
  });

  document.getElementById("export-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Báo cáo tình hình học tập", 10, 10);

    doc.autoTable({ html: "#student-table" });

    // Lấy tọa độ y của dòng cuối cùng của bảng
    const finalY = doc.autoTable.previous.finalY;

    doc.text(reportContent.textContent, 10, finalY + 10);
    doc.save("report.pdf");
  });

  document.getElementById("export-excel").addEventListener("click", () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(students);
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  });

  renderTable();
});

function showReport() {
  document.getElementById("score").style.display = "none";
  document.getElementById("bao-cao-thong-ke").style.display = "block";
}
function backToScore() {
  document.getElementById("score").style.display = "block";
  document.getElementById("bao-cao-thong-ke").style.display = "none";
}

// biểu đồ===================================================================================================
// Dữ liệu mẫu cho tất cả các biểu đồ
const labels = ["SV 1", "SV 2", "SV 3", "SV 4", "SV 5"];
const dataset1 = [10, 9, 3, 5, 2];
const dataset2 = [7, 10, 5, 8, 3];

// Biểu đồ Cột
const barChart = new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Dữ liệu A",
        data: dataset1,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Dữ liệu B",
        data: dataset2,
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  },
});

// Biểu đồ Đường
const lineChart = new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Dữ liệu A",
        data: dataset1,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Dữ liệu B",
        data: dataset2,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  },
});

// Biểu đồ Tròn
const pieChart = new Chart(document.getElementById("pieChart"), {
  type: "pie",
  data: {
    labels: ["A", "B", "C", "D", "E"],
    datasets: [
      {
        data: [10, 20, 30, 25, 15],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  },
});

// Biểu đồ Tháp (Radar)
const radarChart = new Chart(document.getElementById("radarChart"), {
  type: "radar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Dữ liệu A",
        data: dataset1,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "Dữ liệu B",
        data: dataset2,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  },
});
// Biểu đồ cột chồng
const stackedBarChart = new Chart(document.getElementById("stackedBarChart"), {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Dữ liệu A",
        data: dataset1,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "Dữ liệu B",
        data: dataset2,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  },
});
