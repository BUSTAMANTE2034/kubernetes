const baseURL = "https://lalo2034.pythonanywhere.com";
// Función para probar la conexión con el API
function testApiConnection() {
  $.ajax({
    url: baseURL + "/",
    method: "GET",
    success: function (response) {
      $("#connection-message")
        .removeClass("alert-info")
        .addClass("alert-success");
      $("#connection-message").text(response);
    },
    error: function (error) {
      $("#connection-message")
        .removeClass("alert-info")
        .addClass("alert-danger");
      $("#connection-message").text("Error al conectar con el API.");
    },
  });
}
$(document).ready(function () {
  testApiConnection();
});

// Activities Functions
function getActivities() {
  $.ajax({
    url: baseURL + "/activities",
    method: "GET",
    success: function (data) {
      const tbody = $("#activities-table tbody");
      tbody.empty();
      data.forEach(function (activity) {
        tbody.append(
          "<tr>" +
            "<td>" +
            activity.activity_id +
            "</td>" +
            "<td>" +
            activity.name +
            "</td>" +
            "<td>" +
            activity.total_hours +
            "</td>" +
            "</tr>"
        );
      });
    },
    error: function (error) {
      alert("Error al obtener actividades");
    },
  });
}

function openActivityModal(method) {
  $("#activityForm").off("submit");
  if (method === "POST") {
    $("#activityModalLabel").text("Crear Actividad");
    $("#activity_id").val("").prop("disabled", true);
    $("#name").val("");
    $("#total_hours").val("");
    $("#activity_id").off("blur");
  } else if (method === "PUT") {
    $("#activityModalLabel").text("Actualizar Actividad");
    $("#activity_id").val("").prop("disabled", false);
    $("#name").val("");
    $("#total_hours").val("");
    // Add event listener to fetch data when ID is entered
    $("#activity_id")
      .off("blur")
      .on("blur", function () {
        const id = $(this).val();
        if (id) {
          $.ajax({
            url: baseURL + "/activities",
            method: "GET",
            success: function (data) {
              const activity = data.find((a) => a.activity_id == id);
              if (activity) {
                $("#name").val(activity.name);
                $("#total_hours").val(activity.total_hours);
              } else {
                alert("Actividad no encontrada");
                $("#name").val("");
                $("#total_hours").val("");
              }
            },
            error: function (error) {
              alert("Error al obtener actividad");
            },
          });
        }
      });
  }
  $("#activityModal").modal("show");

  $("#activityForm").on("submit", function (event) {
    event.preventDefault();
    const data = {
      name: $("#name").val(),
      total_hours: $("#total_hours").val(),
    };
    if (method === "POST") {
      $.ajax({
        url: baseURL + "/activities",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          alert("Actividad creada exitosamente");
          $("#activityModal").modal("hide");
          getActivities();
        },
        error: function (error) {
          alert("Error al crear actividad");
        },
      });
    } else if (method === "PUT") {
      const id = $("#activity_id").val();
      if (!id) {
        alert("ID de Actividad es requerido para actualizar");
        return;
      }
      $.ajax({
        url: baseURL + "/activities/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          alert("Actividad actualizada exitosamente");
          $("#activityModal").modal("hide");
          getActivities();
        },
        error: function (error) {
          alert("Error al actualizar actividad");
        },
      });
    }
  });
}

function deleteActivity() {
  const id = prompt("Ingrese ID de Actividad a eliminar:");
  if (id) {
    $.ajax({
      url: baseURL + "/activities/" + id,
      method: "DELETE",
      success: function (response) {
        alert("Actividad eliminada exitosamente");
        getActivities();
      },
      error: function (error) {
        alert("Error al eliminar actividad");
      },
    });
  }
}

// Students Functions
function getStudents() {
  $.ajax({
    url: baseURL + "/students",
    method: "GET",
    success: function (data) {
      const tbody = $("#students-table tbody");
      tbody.empty();
      data.forEach(function (student) {
        tbody.append(
          "<tr>" +
            "<td>" +
            student.student_id +
            "</td>" +
            "<td>" +
            student.full_name +
            "</td>" +
            "<td>" +
            student.major +
            "</td>" +
            "<td>" +
            student.semester +
            "</td>" +
            "<td>" +
            student.age +
            "</td>" +
            "<td>" +
            student.complementary_credits +
            "</td>" +
            "</tr>"
        );
      });
    },
    error: function (error) {
      alert("Error al obtener estudiantes");
    },
  });
}

function openStudentModal(method) {
  $("#studentForm").off("submit");
  if (method === "POST") {
    $("#studentModalLabel").text("Crear Estudiante");
    $("#student_id").val("").prop("disabled", false);
    $("#student_full_name").val("");
    $("#major").val("");
    $("#semester").val("");
    $("#age").val("");
    $("#complementary_credits").val("");
    $("#student_id").off("blur");
  } else if (method === "PUT") {
    $("#studentModalLabel").text("Actualizar Estudiante");
    $("#student_id").val("").prop("disabled", false);
    $("#student_full_name").val("");
    $("#major").val("");
    $("#semester").val("");
    $("#age").val("");
    $("#complementary_credits").val("");
    // Add event listener to fetch data when ID is entered
    $("#student_id")
      .off("blur")
      .on("blur", function () {
        const id = $(this).val();
        if (id) {
          $.ajax({
            url: baseURL + "/students",
            method: "GET",
            success: function (data) {
              const student = data.find((s) => s.student_id == id);
              if (student) {
                $("#student_full_name").val(student.full_name);
                $("#major").val(student.major);
                $("#semester").val(student.semester);
                $("#age").val(student.age);
                $("#complementary_credits").val(student.complementary_credits);
              } else {
                alert("Estudiante no encontrado");
                $("#student_full_name").val("");
                $("#major").val("");
                $("#semester").val("");
                $("#age").val("");
                $("#complementary_credits").val("");
              }
            },
            error: function (error) {
              alert("Error al obtener estudiante");
            },
          });
        }
      });
  }
  $("#studentModal").modal("show");

  $("#studentForm").on("submit", function (event) {
    event.preventDefault();
    const data = {
      full_name: $("#student_full_name").val(),
      major: $("#major").val(),
      semester: $("#semester").val(),
      age: $("#age").val(),
      complementary_credits: $("#complementary_credits").val(),
    };
    if (method === "POST") {
      data["student_id"] = $("#student_id").val();
      $.ajax({
        url: baseURL + "/students",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          alert("Estudiante creado exitosamente");
          $("#studentModal").modal("hide");
          getStudents();
        },
        error: function (error) {
          alert("Error al crear estudiante");
        },
      });
    } else if (method === "PUT") {
      const id = $("#student_id").val();
      if (!id) {
        alert("ID de Estudiante es requerido para actualizar");
        return;
      }
      $.ajax({
        url: baseURL + "/students/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          alert("Estudiante actualizado exitosamente");
          $("#studentModal").modal("hide");
          getStudents();
        },
        error: function (error) {
          alert("Error al actualizar estudiante");
        },
      });
    }
  });
}

function deleteStudent() {
  const id = prompt("Ingrese ID de Estudiante a eliminar:");
  if (id) {
    $.ajax({
      url: baseURL + "/students/" + id,
      method: "DELETE",
      success: function (response) {
        alert("Estudiante eliminado exitosamente");
        getStudents();
      },
      error: function (error) {
        alert("Error al eliminar estudiante");
      },
    });
  }
}

// Teachers Functions
function getTeachers() {
  $.ajax({
    url: baseURL + "/teachers",
    method: "GET",
    success: function (data) {
      const tbody = $("#teachers-table tbody");
      tbody.empty();
      data.forEach(function (teacher) {
        tbody.append(
          "<tr>" +
            "<td>" +
            teacher.teacher_id +
            "</td>" +
            "<td>" +
            teacher.full_name +
            "</td>" +
            "<td>" +
            teacher.activity_id +
            "</td>" +
            "</tr>"
        );
      });
    },
    error: function (error) {
      alert("Error al obtener maestros");
    },
  });
}

function openTeacherModal(method) {
  $("#teacherForm").off("submit");
  if (method === "POST") {
    $("#teacherModalLabel").text("Crear Maestro");
    $("#teacher_id").val("").prop("disabled", false);
    $("#teacher_full_name").val("");
    $("#teacher_activity_id").val("");
    $("#teacher_id").off("blur");
  } else if (method === "PUT") {
    $("#teacherModalLabel").text("Actualizar Maestro");
    $("#teacher_id").val("").prop("disabled", false);
    $("#teacher_full_name").val("");
    $("#teacher_activity_id").val("");
    // Add event listener to fetch data when ID is entered
    $("#teacher_id")
      .off("blur")
      .on("blur", function () {
        const id = $(this).val();
        if (id) {
          $.ajax({
            url: baseURL + "/teachers",
            method: "GET",
            success: function (data) {
              const teacher = data.find((t) => t.teacher_id == id);
              if (teacher) {
                $("#teacher_full_name").val(teacher.full_name);
                $("#teacher_activity_id").val(teacher.activity_id);
              } else {
                alert("Maestro no encontrado");
                $("#teacher_full_name").val("");
                $("#teacher_activity_id").val("");
              }
            },
            error: function (error) {
              alert("Error al obtener maestro");
            },
          });
        }
      });
  }
  $("#teacherModal").modal("show");

  $("#teacherForm").on("submit", function (event) {
    event.preventDefault();
    const data = {
      full_name: $("#teacher_full_name").val(),
      activity_id: $("#teacher_activity_id").val(),
    };
    if (method === "POST") {
      data["teacher_id"] = $("#teacher_id").val();
      $.ajax({
        url: baseURL + "/teachers",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          alert("Maestro creado exitosamente");
          $("#teacherModal").modal("hide");
          getTeachers();
        },
        error: function (error) {
          alert("Error al crear maestro");
        },
      });
    } else if (method === "PUT") {
      const id = $("#teacher_id").val();
      if (!id) {
        alert("ID de Maestro es requerido para actualizar");
        return;
      }
      $.ajax({
        url: baseURL + "/teachers/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          alert("Maestro actualizado exitosamente");
          $("#teacherModal").modal("hide");
          getTeachers();
        },
        error: function (error) {
          alert("Error al actualizar maestro");
        },
      });
    }
  });
}

function deleteTeacher() {
  const id = prompt("Ingrese ID de Maestro a eliminar:");
  if (id) {
    $.ajax({
      url: baseURL + "/teachers/" + id,
      method: "DELETE",
      success: function (response) {
        alert("Maestro eliminado exitosamente");
        getTeachers();
      },
      error: function (error) {
        alert("Error al eliminar maestro");
      },
    });
  }
}

// InProgress Functions
function getInProgress() {
  $.ajax({
    url: baseURL + "/in_progress",
    method: "GET",
    success: function (data) {
      const tbody = $("#inprogress-table tbody");
      tbody.empty();
      data.forEach(function (course) {
        tbody.append(
          "<tr>" +
            "<td>" +
            course.course_id +
            "</td>" +
            "<td>" +
            course.student_id +
            "</td>" +
            "<td>" +
            course.teacher_id +
            "</td>" +
            "<td>" +
            course.day_of_week +
            "</td>" +
            "<td>" +
            course.schedule +
            "</td>" +
            "<td>" +
            course.hours_completed +
            "</td>" +
            "<td>" +
            course.hours_pending +
            "</td>" +
            "</tr>"
        );
      });
    },
    error: function (error) {
      alert("Error al obtener clases en progreso");
    },
  });
}

function openInProgressModal(method) {
  $("#inProgressForm").off("submit");
  if (method === "POST") {
    $("#inProgressModalLabel").text("Crear Clase en Progreso");
    $("#course_id").val("").prop("disabled", true);
    $("#inprogress_student_id").val("");
    $("#inprogress_teacher_id").val("");
    $("#day_of_week").val("");
    $("#schedule").val("");
    $("#hours_completed").val("");
    $("#hours_pending").val("");
    $("#course_id").off("blur");
  } else if (method === "PUT") {
    $("#inProgressModalLabel").text("Actualizar Clase en Progreso");
    $("#course_id").val("").prop("disabled", false);
    $("#inprogress_student_id").val("");
    $("#inprogress_teacher_id").val("");
    $("#day_of_week").val("");
    $("#schedule").val("");
    $("#hours_completed").val("");
    $("#hours_pending").val("");
    // Add event listener to fetch data when ID is entered
    $("#course_id")
      .off("blur")
      .on("blur", function () {
        const id = $(this).val();
        if (id) {
          $.ajax({
            url: baseURL + "/in_progress",
            method: "GET",
            success: function (data) {
              const course = data.find((c) => c.course_id == id);
              if (course) {
                $("#inprogress_student_id").val(course.student_id);
                $("#inprogress_teacher_id").val(course.teacher_id);
                $("#day_of_week").val(course.day_of_week);
                $("#schedule").val(course.schedule);
                $("#hours_completed").val(course.hours_completed);
                $("#hours_pending").val(course.hours_pending);
              } else {
                alert("Clase en progreso no encontrada");
                $("#inprogress_student_id").val("");
                $("#inprogress_teacher_id").val("");
                $("#day_of_week").val("");
                $("#schedule").val("");
                $("#hours_completed").val("");
                $("#hours_pending").val("");
              }
            },
            error: function (error) {
              alert("Error al obtener clase en progreso");
            },
          });
        }
      });
  }
  $("#inProgressModal").modal("show");

  $("#inProgressForm").on("submit", function (event) {
    event.preventDefault();
    const data = {
      student_id: $("#inprogress_student_id").val(),
      teacher_id: $("#inprogress_teacher_id").val(),
      day_of_week: $("#day_of_week").val(),
      schedule: $("#schedule").val(),
      hours_completed: $("#hours_completed").val(),
      hours_pending: $("#hours_pending").val(),
    };
    if (method === "POST") {
      $.ajax({
        url: baseURL + "/in_progress",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          alert("Clase en progreso creada exitosamente");
          $("#inProgressModal").modal("hide");
          getInProgress();
        },
        error: function (error) {
          alert("Error al crear clase en progreso");
        },
      });
    } else if (method === "PUT") {
      const id = $("#course_id").val();
      if (!id) {
        alert("ID del Curso es requerido para actualizar");
        return;
      }
      $.ajax({
        url: baseURL + "/in_progress/" + id,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          alert("Clase en progreso actualizada exitosamente");
          $("#inProgressModal").modal("hide");
          getInProgress();
        },
        error: function (error) {
          alert("Error al actualizar clase en progreso");
        },
      });
    }
  });
}

function deleteInProgress() {
  const id = prompt("Ingrese ID del Curso a eliminar:");
  if (id) {
    $.ajax({
      url: baseURL + "/in_progress/" + id,
      method: "DELETE",
      success: function (response) {
        alert("Clase en progreso eliminada exitosamente");
        getInProgress();
      },
      error: function (error) {
        alert("Error al eliminar clase en progreso");
      },
    });
  }
}
