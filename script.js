"use strict";

/*Menu adaptable*/

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#menu-principal");

if (menuToggle && mainNav) {
  function setMenuOpen(open) {
    mainNav.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  }

  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    setMenuOpen(!isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 900px)");

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}

/*Filtros*/

const filterButtons = document.querySelectorAll("[data-filter]");
const discoveryCards = document.querySelectorAll(".discovery-card");
const filterStatus = document.querySelector("#filter-status");

function filterDiscoveries(category) {
  let visibleCount = 0;

  discoveryCards.forEach((card) => {
    const matches =
      category === "todos" ||
      card.dataset.category === category;

    card.hidden = !matches;

    if (matches) {
      visibleCount++;
    }
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (filterStatus) {
    filterStatus.textContent =
      `${visibleCount} temas visibles.`;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterDiscoveries(button.dataset.filter);
  });
});

/*Validación */

const registrationForm =
  document.querySelector("#registration-form");

if (registrationForm) {
  const statusMessage =
    document.querySelector("#form-status");

  const fields = [
    {
      input: document.querySelector("#nombre"),
      error: document.querySelector("#nombre-error"),
      validate(input) {
        if (!input.value.trim()) {
          return "Escribe tu nombre completo.";
        }

        if (input.value.trim().length < 3) {
          return "El nombre debe tener al menos 3 caracteres.";
        }

        return "";
      }
    },
    {
      input: document.querySelector("#correo"),
      error: document.querySelector("#correo-error"),
      validate(input) {
        if (!input.value.trim()) {
          return "Escribe tu correo electrónico.";
        }

        if (!input.validity.valid) {
          return "Introduce un correo electrónico válido.";
        }

        return "";
      }
    },
    {
      input: document.querySelector("#perfil"),
      error: document.querySelector("#perfil-error"),
      validate(input) {
        if (!input.value) {
          return "Selecciona tu perfil de participante.";
        }

        return "";
      }
    }
  ];

  function validateField(field) {
    if (!field.input || !field.error) {
      return true;
    }

    const message = field.validate(field.input);

    field.error.textContent = message;

    if (message) {
      field.input.setAttribute("aria-invalid", "true");
      field.input.setAttribute("aria-describedby",
        field.error.id);
      return false;
    }

    field.input.removeAttribute("aria-invalid");
    field.input.removeAttribute("aria-describedby");
    return true;
  }

  fields.forEach((field) => {
    if (!field.input) return;

    field.input.addEventListener("input", () => {
      validateField(field);

      if (statusMessage) {
        statusMessage.textContent = "";
      }
    });

    field.input.addEventListener("change", () => {
      validateField(field);
    });
  });

  registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = fields.map(validateField);
    const firstInvalid = fields.find(
      (field, index) => !results[index]
    );

    if (firstInvalid) {
      if (statusMessage) {
        statusMessage.textContent =
          "Revisa los campos señalados antes de continuar.";
      }

      firstInvalid.input.focus();
      return;
    }

    if (statusMessage) {
      statusMessage.textContent =
        "Validación correcta. Esta demostración no envía datos " +
        "a un servidor.";
    }
  });
}