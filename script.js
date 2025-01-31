document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    const toggleThemeBtn = document.querySelector('.toggle-theme');
    const chatLog = document.getElementById('chat-log');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const API_URL = "https://api.openai.com/v1/chat/completions";

    let API_KEY = ""; // Déclare globalement la clé API

// Charger la clé API depuis api-key.json dans GitHub Actions
fetch('api-key.json')
  .then(response => response.json())
  .then(data => {
    API_KEY = data.OPENAI_API_KEY;
    console.log("✅ Clé API chargée :", API_KEY);
  })
  .catch(error => {
    console.error("❌ Erreur : Impossible de récupérer la clé API", error);
    alert("Erreur : Clé API non disponible.");
  });

// Vérifie si la clé est disponible avant d'envoyer la requête
const sendMessage = () => {
  if (!API_KEY) {
    alert("Erreur : Clé API non disponible.");
    return;
  }

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Ajouter le message utilisateur
  const outgoingChat = createConversation(userMessage, "outgoing");
  chatLog.appendChild(outgoingChat);

  // Ajouter le message en attente de l'IA
  const incomingChat = createConversation("En cours d'écriture...", "incoming");
  chatLog.appendChild(incomingChat);

  // Appeler l'API OpenAI pour obtenir une réponse
  getResponse(userMessage, incomingChat);

  // Effacer le champ de saisie
  userInput.value = "";
  userInput.style.height = "auto";
};
    

    
    let isDarkTheme = true;

    const skills = [];

    const softskills = [];

    const softskillsList = document.getElementById('softskills-list');
    softskills.forEach(skill => {
        const skillElement = document.createElement('pre');
        skillElement.textContent = skill;
        softskillsList.appendChild(skillElement);
    });

    const skillsList = document.getElementById('skills-list');
    skills.forEach(skill => {
        const skillElement = document.createElement('pre');
        skillElement.textContent = skill;
        skillsList.appendChild(skillElement);
    });

    const toggleTheme = () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('light-theme', !isDarkTheme);
        document.body.classList.toggle('dark-theme', isDarkTheme);
        toggleThemeBtn.textContent = isDarkTheme ? '🌙' : '☀️';
        
        const matrixCanvas = document.getElementById('matrixCanvas');
        if (isDarkTheme) {
            matrixCanvas.style.display = 'block';
        } else {
            matrixCanvas.style.display = 'none';
        }
    };

    toggleThemeBtn.addEventListener('click', toggleTheme);

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    };

    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    const navLinks = document.querySelectorAll('nav ul li a, .logo');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
    
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });

            // Fermer le menu après le clic sur un lien
            navLinksContainer.classList.remove('active');
        });
    });
    
    const burger = document.querySelector('.burger');
    const navLinksContainer = document.querySelector('.nav-links');
    
    burger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinksContainer.contains(event.target) || burger.contains(event.target);
        if (!isClickInsideNav) {
            navLinksContainer.classList.remove('active');
        }
    });

    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const hanzi = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
    const katakana = "ⴰⴱⴳⴷⴹⴻⴼⴽⵀⵃⵄⵅⵇⵉⵊⵍⵎⵏⵓⵔⵕⵖⵙⵚⵛⵜⵟⵡⵢⵣⵥⵯⴲⴴⴵⴶⴸⴺⴿⵞⵁⵒⵠ";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";

    const characters = hanzi + latin + numbers + katakana;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; //Fond légèrement transparent
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Efface le canvas

        ctx.fillStyle = '#bb86fc'; // Texte violet néon
      // Ombre violet néon
        // Intensité de l'ombre
        ctx.font = fontSize + 'px monospace';  // Font size and style

        for (let i = 0; i < drops.length; i++) { // Loop over the drops
            const text = characters.charAt(Math.floor(Math.random() * characters.length)); // Random character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize); // x, y

            if (drops[i] * fontSize < 0 && Math.random() > 0.975) {  // Randomize the reset
                drops[i] = canvas.height / fontSize; ;  // Reset the drop
            }
            drops[i]--; // Move the drop down
        }
    };

    setInterval(draw, 40); // Draw every 40 milliseconds

 // IA Assistant Chatbox
// Fonction pour créer une conversation

    const createConversation = (message, className) => {
        const chatSection = document.createElement("div");
        chatSection.classList.add("chat", className);
        chatSection.style.marginBottom = "10px";
        const chatContent =
            className === "outgoing"
                ? `<p style="color: #bb86fc;">Vous : ${message}</p>`
                : `<p style="color: white;">IA : ${message}</p>`;
        chatSection.innerHTML = chatContent;
        return chatSection;
    };

    // Fonction pour récupérer une réponse de l'API OpenAI
    const getResponse = async (userMessage, incomingChat) => {
        if (!API_KEY) {
            console.error("❌ Erreur : Clé API non chargée.");
            incomingChat.innerHTML = '<p style="color: red;">Erreur : Clé API non disponible.</p>';
            return;
        }

        const API_URL = "https://api.openai.com/v1/chat/completions";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: userMessage }],
                }),
            });

            if (!response.ok) {
                throw new Error(`Erreur API : ${response.statusText}`);
            }

            const data = await response.json();

            if (data.choices && data.choices.length > 0) {
                incomingChat.innerHTML = `<p style="color: white;">IA : ${data.choices[0].message.content.trim()}</p>`;
            } else {
                throw new Error("Réponse invalide de l'API.");
            }
        } catch (error) {
            console.error("❌ Erreur lors de la requête OpenAI :", error);
            incomingChat.innerHTML = '<p style="color: red;">Erreur : Impossible de récupérer une réponse.</p>';
        } finally {
            chatLog.scrollTop = chatLog.scrollHeight;
        }
    };

    // Fonction pour gérer l'envoi de messages (gardée)
    /*const sendMessage = () => {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        // Ajouter le message utilisateur
        const outgoingChat = createConversation(userMessage, "outgoing");
        chatLog.appendChild(outgoingChat);

        // Ajouter le message en attente de l'IA
        const incomingChat = createConversation("En cours d'écriture...", "incoming");
        chatLog.appendChild(incomingChat);

        // Appeler l'API OpenAI pour obtenir une réponse
        getResponse(userMessage, incomingChat);

        // Effacer le champ de saisie
        userInput.value = "";
        userInput.style.height = "auto";
    };*/

    // Écouteurs d'événements pour envoyer un message
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Fonction pour ajuster la hauteur de la zone de saisie
    userInput.addEventListener("input", () => {
        userInput.style.height = "auto";
        userInput.style.height = `${userInput.scrollHeight}px`;
    });
});

 

const modal = document.getElementById("projectModal");
const modalImg = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalObjective = document.getElementById("modalObjective");
const modalRole = document.getElementById("modalRole");
const modalDescription = document.getElementById("modalDescription");
const modalLanguages = document.getElementById("modalLanguages"); // New element for languages
const projectCards = document.querySelectorAll('.expandable-card');
const closeModal = document.getElementsByClassName("close")[0];

// Project details mapped by project identifier
const projectDetails = {
    "bigdata": {
        title: "Big Data Framework",
        objective: "Develop a tracking application for Nasdaq stock data using financial data from the Yahoo Finance API in a Python environment.",
        role: "Developer",
        description: "Designed and developed a big data framework to analyze and monitor stock performance, focusing on efficient data extraction and processing.",
        languages: "Python"
    },
    "ml": {
        title: "Machine Learning",
        objective: "Build a predictive model to answer the question: 'Which types of people were most likely to survive?'",
        role: "Data Scientist",
        description: "Developed a machine learning model to predict passenger survival based on features such as name, age, gender, and socio-economic class, using Kaggle's Titanic dataset. The project involved data preprocessing, feature engineering, and training classification models.",
        languages: "Python, Pandas, Scikit-learn, Matplotlib"    
    },
    "datavis": {
        title: "Data Visualization",
        objective: "Analyze trends in the French real estate market over the past five years.",
        role: "Data Analyst",
        description: "Conducted a comprehensive analysis of the French real estate market using data from the past five years. The project involved cleaning and preprocessing data, visualizing price trends, identifying regional differences, and providing actionable insights into market dynamics.",
        languages: "Python, Pandas, Matplotlib, Seaborn"
    },
    "ai": {
        title: "Artificial Intelligence",
        objective: "Develop a system for facial recognition using AI algorithms.",
        role: "Team Member",
        description: "Collaborated on creating a facial recognition system using AI and machine learning, implemented with MATLAB.",
        languages: "MATLAB"
    },
    "oopjava": {
        title: "OOP JAVA",
        objective: "Develop a hotel reservation application.",
        role: "Full Stack Developer",
        description: "Developed a Java-based hotel reservation system allowing users to manage bookings, availability, and customer profiles.",
        languages: "Java, SQL"
    },
    "prototype": {
        title: "Electronic Prototype",
        objective: "Build an ECG device using Arduino.",
        role: "Hardware Developer",
        description: "Designed and implemented an electrocardiogram device using Arduino to monitor heart activity.",
        languages: "Arduino, C"
    },
    "algo": {
        title: "Algorithm and Programming",
        objective: "Create a game inspired by Snoopy.",
        role: "Game Developer",
        description: "Developed a C-based text game allowing users to interact with the game via a graphical interface.",
        languages: "C"
    },
    "webdev": {
        title: "Web Programming",
        objective: "Build a website for a sports hall.",
        role: "Web Developer",
        description: "Developed a web application for managing bookings and information for a sports hall, ensuring user-friendly functionality.",
        languages: "HTML, CSS, JavaScript"
    }
};


projectCards.forEach(card => {
    card.addEventListener('click', function(){
        const projectId = this.getAttribute('data-project');
        const details = projectDetails[projectId];

        modal.style.display = "block";
        modalImg.src = this.querySelector('img').src;
        modalTitle.innerText = details.title;
        modalObjective.innerText = details.objective;
        modalRole.innerText = details.role;
        modalDescription.innerText = details.description;
        modalLanguages.innerText = details.languages; // Display languages and tools
    });
});

closeModal.onclick = function() { 
    modal.style.display = "none"; // Close the modal
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Close modal when pressing the Escape key

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        modal.style.display = "none";
    }
}
);

