// 🔔 Notificări
const notyf = new Notyf();

// ⏳ COUNTDOWN
try {
  const releaseDate = new Date("2025-10-03T17:00:00");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date();
    const diff = releaseDate - now;

    if (diff <= 0) {
      daysEl.textContent =
        hoursEl.textContent =
        minutesEl.textContent =
        secondsEl.textContent =
          "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, "0");
    hoursEl.textContent = hours.toString().padStart(2, "0");
    minutesEl.textContent = minutes.toString().padStart(2, "0");
    secondsEl.textContent = seconds.toString().padStart(2, "0");

    secondsEl.style.color = "var(--accent-color)";
    setTimeout(() => {
      secondsEl.style.color = "var(--text-color)";
    }, 500);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
} catch (error) {
  console.log(error);
}

// 📜 GSAP SCROLL ANIMATIONS
try {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#main",
      start: "50% 50%",
      end: "50% 0%",
      scrub: 1,
      pin: true,
    },
  });

  tl.to("#center", { height: "100vh" }, "a")
    .to("#top", { top: "-50%" }, "a")
    .to("#bottom", { bottom: "-50%" }, "a")
    .to("#top-h1", { bottom: "10%" }, "a")
    .to("#bottom-h1", { bottom: "50%" }, "a")
    .to("#center-h1", { top: "-30%" }, "a")
    .to(".content", { marginTop: "0%" })
    .to(".text_one", { opacity: "1" });
} catch (error) {
  console.log(error);
}

// 👂 ONLOAD SETUP
window.onload = function () {
  const radios = document.querySelectorAll('input[name="radio"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", function () {
      toggleExtraFields(this.value === "1");
    });
  });

  const idBin = localStorage.getItem("CON");
  const submitBtn = document.querySelector("#myForm .btn");

  if (idBin) {
    fetch(`https://api.jsonbin.io/v3/b/${idBin}`, {
      method: "GET",
      headers: {
        "X-Master-Key":
          "$2a$10$kUW17xI2bsNfU0G3z7qrxuxE0BbGtz8mZ8K7Bf75JWSayMQlimekK",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        populateForm(json.record);
        submitBtn.innerHTML =
          '<i class="animations"></i>Actualizare<i class="animations"></i>';
      })
      .catch((err) => console.error("Eroare la citire:", err));
  }
};

// ✅ TOGGLE FIELDS
function toggleExtraFields(show) {
  const extraFields = document.querySelector(".no_part");
  extraFields.style.display = show ? "block" : "none";

  extraFields.querySelectorAll("input, select, textarea").forEach((el) => {
    show ? el.removeAttribute("disabled") : el.setAttribute("disabled", true);
    show ? el.setAttribute("required", true) : el.removeAttribute("required");
  });
}

// ☎️ TELEFON FORMAT
const phoneInput = document.getElementById("numar_telefon");
phoneInput.addEventListener("input", function () {
  let input = this.value.replace(/\D/g, "").substring(0, 10);
  if (input.length > 6)
    input = input.replace(/(\d{4})(\d{3})(\d{0,3})/, "$1 $2 $3");
  else if (input.length > 3) input = input.replace(/(\d{4})(\d{0,3})/, "$1 $2");
  this.value = input.trim();
});

// ✍️ POPULARE FORM
function populateForm(data) {
  const radio = document.querySelector(
    `input[name="radio"][value="${data.participare === "Da" ? 1 : 0}"]`
  );
  if (radio) {
    radio.checked = true;
    toggleExtraFields(data.participare === "Da");
  }
  if (data.nume) document.querySelector('input[name="nume"]').value = data.nume;
  if (data.numar_adulti)
    document.querySelector('input[name="numar_adulti"]').value =
      data.numar_adulti;
  if (data.numar_copii)
    document.querySelector('input[name="numar_copii"]').value =
      data.numar_copii;
  if (data.numar_telefon)
    document.querySelector('input[name="numar_telefon"]').value =
      data.numar_telefon;
  if (data.message)
    document.querySelector('textarea[name="message"]').value = data.message;
}

// 📤 FORM SUBMIT
const form = document.getElementById("myForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    if (key === "radio") {
      data["participare"] = value === "1" ? "Da" : "Nu";
    } else {
      data[key] = value;
    }
  });

  const idBin = localStorage.getItem("CON");
  const url = idBin
    ? `https://api.jsonbin.io/v3/b/${idBin}`
    : "https://api.jsonbin.io/v3/b";
  const method = idBin ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Bin-Private": "false",
      "X-Master-Key":"$2a$10$kUW17xI2bsNfU0G3z7qrxuxE0BbGtz8mZ8K7Bf75JWSayMQlimekK",
      "X-Collection-Id": "6874cb5e2df20b5e59cd7d4c", // Aici adăugăm ID-ul colecției
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Eroare la trimitere");
      return res.json();
    })
    .then((json) => {
      const id = json.metadata.id;
      notyf.success(idBin ? "Date actualizate cu succes" : `Trimis (#${id})`);
      if (!idBin) localStorage.setItem("CON", id);
    })
    .catch((err) => {
      console.error("Eroare la salvare:", err);
      notyf.error("Eroare la trimitere!");
    });
});
