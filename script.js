// Charger les données du menu
let menuData;

// Copier le fichier JSON dans le répertoire du site web
fetch('/menu_options.json')
  .then(response => response.json())
  .then(data => {
    menuData = data;
    populateMenuOptions();
  })
  .catch(error => {
    console.error('Erreur lors du chargement des données du menu:', error);
  });

// Fonction pour remplir les options de menu
function populateMenuOptions() {
  // 22 avril - Plat principal
  const main22Container = document.getElementById('main-22');
  menuData['22 avril']['Plat principal'].forEach((option, index) => {
    const optionElement = createOptionElement('main-22', option, index);
    main22Container.appendChild(optionElement);
  });

  // 22 avril - Dessert
  const dessert22Container = document.getElementById('dessert-22');
  menuData['22 avril']['Dessert'].forEach((option, index) => {
    const optionElement = createOptionElement('dessert-22', option, index);
    dessert22Container.appendChild(optionElement);
  });

  // 23 avril - Plat principal
  const main23Container = document.getElementById('main-23');
  menuData['23 avril']['Plat principal'].forEach((option, index) => {
    const optionElement = createOptionElement('main-23', option, index);
    main23Container.appendChild(optionElement);
  });

  // 23 avril - Dessert
  const dessert23Container = document.getElementById('dessert-23');
  menuData['23 avril']['Dessert'].forEach((option, index) => {
    const optionElement = createOptionElement('dessert-23', option, index);
    dessert23Container.appendChild(optionElement);
  });

  // 24 avril - Plat principal
  const main24Container = document.getElementById('main-24');
  menuData['24 avril']['Plat principal'].forEach((option, index) => {
    const optionElement = createOptionElement('main-24', option, index);
    main24Container.appendChild(optionElement);
  });
  
  // 24 avril - Dessert
  const dessert24Container = document.getElementById('dessert-24');
  menuData['24 avril']['Dessert'].forEach((option, index) => {
    const optionElement = createOptionElement('dessert-24', option, index);
    dessert24Container.appendChild(optionElement);
  });
}

// Fonction pour créer un élément d'option
function createOptionElement(groupName, optionText, index) {
  const div = document.createElement('div');
  div.className = 'option-item';

  const input = document.createElement('input');
  input.type = 'radio';
  input.id = `${groupName}-option-${index}`;
  input.name = groupName;
  input.value = optionText;

  const label = document.createElement('label');
  label.htmlFor = `${groupName}-option-${index}`;
  label.textContent = optionText;

  div.appendChild(input);
  div.appendChild(label);

  return div;
}

// Gérer la soumission du formulaire
document.getElementById('menu-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const studentLastname = document.getElementById('student-lastname').value;
  const studentFirstname = document.getElementById('student-firstname').value;
  
  if (!studentLastname) {
    alert("Veuillez entrer le nom de l'élève.");
    return;
  }
  
  if (!studentFirstname) {
    alert("Veuillez entrer le prénom de l'élève.");
    return;
  }
  
  // Vérifier que tous les choix ont été faits
  const requiredGroups = ['main-22', 'dessert-22', 'main-23', 'dessert-23', 'main-24', 'dessert-24'];
  let missingChoices = [];
  
  requiredGroups.forEach(group => {
    const selected = document.querySelector(`input[name="${group}"]:checked`);
    if (!selected) {
      missingChoices.push(group);
    }
  });
  
  if (missingChoices.length > 0) {
    let missingMessage = "Veuillez faire vos choix pour :\n";
    missingChoices.forEach(group => {
      let day, meal;
      if (group.includes('22')) day = '22 avril';
      else if (group.includes('23')) day = '23 avril';
      else day = '24 avril';
      
      if (group.includes('main')) meal = 'Plat principal';
      else meal = 'Dessert';
      
      missingMessage += `- ${day} (${meal})\n`;
    });
    
    alert(missingMessage);
    return;
  }
  
  // Collecter les choix
  const choices = {
    "Nom de l'élève": studentLastname,
    "Prénom de l'élève": studentFirstname,
    "22 avril - Plat principal": document.querySelector('input[name="main-22"]:checked').value,
    "22 avril - Dessert": document.querySelector('input[name="dessert-22"]:checked').value,
    "23 avril - Plat principal": document.querySelector('input[name="main-23"]:checked').value,
    "23 avril - Dessert": document.querySelector('input[name="dessert-23"]:checked').value,
    "24 avril - Plat principal": document.querySelector('input[name="main-24"]:checked').value,
    "24 avril - Dessert": document.querySelector('input[name="dessert-24"]:checked').value
  };
  
  // Envoyer les données à Google Sheets
  sendToGoogleSheets(choices);
  
  // Afficher le récapitulatif
  displaySummary(choices);
  
  // Afficher le bouton de téléchargement
  document.getElementById('download-btn').style.display = 'block';
});

// Fonction pour envoyer les données à Google Sheets
function sendToGoogleSheets(data) {
  // URL du script Google Apps Script déployé en tant qu'application web
  // Cette URL doit être remplacée par l'URL de votre script déployé
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwNutXthp0d5vd5-fVBZHqF_uVO_lGU6neUzx_UUedo7Pjot16msQIJ4CqmXe_F6fzDlQ/exec';
  
  // Créer un objet FormData pour l'envoi
  const formData = new FormData();
  
  // Ajouter chaque champ au FormData
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  
  // Envoyer les données via fetch API
  fetch(scriptURL, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      console.log('Données envoyées avec succès à Google Sheets');
      // Afficher un message de confirmation
      const confirmationMessage = document.createElement('div');
      confirmationMessage.className = 'confirmation-message';
      confirmationMessage.textContent = 'Vos choix ont été enregistrés avec succès dans Google Sheets!';
      document.querySelector('.results').prepend(confirmationMessage);
    } else {
      console.error('Erreur lors de l\'envoi des données:', response.statusText);
      alert('Une erreur est survenue lors de l\'envoi des données à Google Sheets. Veuillez réessayer.');
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    alert('Une erreur est survenue lors de l\'envoi des données à Google Sheets. Veuillez réessayer.');
  });
}

// Afficher le récapitulatif des choix
function displaySummary(choices) {
  const summaryContainer = document.getElementById('choices-summary');
  summaryContainer.innerHTML = '';
  
  const table = document.createElement('table');
  table.className = 'summary-table';
  
  // En-tête
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  const nameHeader = document.createElement('th');
  nameHeader.textContent = "Nom et prénom";
  headerRow.appendChild(nameHeader);
  
  const dayHeader = document.createElement('th');
  dayHeader.textContent = "Jour";
  headerRow.appendChild(dayHeader);
  
  const mealHeader = document.createElement('th');
  mealHeader.textContent = "Type de repas";
  headerRow.appendChild(mealHeader);
  
  const choiceHeader = document.createElement('th');
  choiceHeader.textContent = "Choix";
  headerRow.appendChild(choiceHeader);
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Corps du tableau
  const tbody = document.createElement('tbody');
  
  // 22 avril - Plat principal
  const row1 = document.createElement('tr');
  
  const nameCell1 = document.createElement('td');
  nameCell1.textContent = `${choices["Nom de l'élève"]} ${choices["Prénom de l'élève"]}`;
  nameCell1.rowSpan = 6; // Mise à jour pour inclure le dessert du 24 avril
  row1.appendChild(nameCell1);
  
  const dayCell1 = document.createElement('td');
  dayCell1.textContent = "22 avril";
  dayCell1.rowSpan = 2;
  row1.appendChild(dayCell1);
  
  const mealCell1 = document.createElement('td');
  mealCell1.textContent = "Plat principal";
  row1.appendChild(mealCell1);
  
  const choiceCell1 = document.createElement('td');
  choiceCell1.textContent = choices["22 avril - Plat principal"];
  row1.appendChild(choiceCell1);
  
  tbody.appendChild(row1);
  
  // 22 avril - Dessert
  const row2 = document.createElement('tr');
  
  const mealCell2 = document.createElement('td');
  mealCell2.textContent = "Dessert";
  row2.appendChild(mealCell2);
  
  const choiceCell2 = document.createElement('td');
  choiceCell2.textContent = choices["22 avril - Dessert"];
  row2.appendChild(choiceCell2);
  
  tbody.appendChild(row2);
  
  // 23 avril - Plat principal
  const row3 = document.createElement('tr');
  
  const dayCell3 = document.createElement('td');
  dayCell3.textContent = "23 avril";
  dayCell3.rowSpan = 2;
  row3.appendChild(dayCell3);
  
  const mealCell3 = document.createElement('td');
  mealCell3.textContent = "Plat principal";
  row3.appendChild(mealCell3);
  
  const choiceCell3 = document.createElement('td');
  choiceCell3.textContent = choices["23 avril - Plat principal"];
  row3.appendChild(choiceCell3);
  
  tbody.appendChild(row3);
  
  // 23 avril - Dessert
  const row4 = document.createElement('tr');
  
  const mealCell4 = document.createElement('td');
  mealCell4.textContent = "Dessert";
  row4.appendChild(mealCell4);
  
  const choiceCell4 = document.createElement('td');
  choiceCell4.textContent = choices["23 avril - Dessert"];
  row4.appendChild(choiceCell4);
  
  tbody.appendChild(row4);
  
  // 24 avril - Plat principal
  const row5 = document.createElement('tr');
  
  const dayCell5 = document.createElement('td');
  dayCell5.textContent = "24 avril";
  dayCell5.rowSpan = 2; // Mise à jour pour inclure le dessert
  row5.appendChild(dayCell5);
  
  const mealCell5 = document.createElement('td');
  mealCell5.textContent = "Plat principal";
  row5.appendChild(mealCell5);
  
  const choiceCell5 = document.createElement('td');
  choiceCell5.textContent = choices["24 avril - Plat principal"];
  row5.appendChild(choiceCell5);
  
  tbody.appendChild(row5);
  
  // 24 avril - Dessert (nouveau)
  const row6 = document.createElement('tr');
  
  const mealCell6 = document.createElement('td');
  mealCell6.textContent = "Dessert";
  row6.appendChild(mealCell6);
  
  const choiceCell6 = document.createElement('td');
  choiceCell6.textContent = choices["24 avril - Dessert"];
  row6.appendChild(choiceCell6);
  
  tbody.appendChild(row6);
  
  table.appendChild(tbody);
  summaryContainer.appendChild(table);
}

// Gérer le bouton de téléchargement
document.getElementById('download-btn').addEventListener('click', function() {
  const studentLastname = document.getElementById('student-lastname').value;
  const studentFirstname = document.getElementById('student-firstname').value;
  
  // Collecter les choix
  const choices = {
    "Nom de l'élève": studentLastname,
    "Prénom de l'élève": studentFirstname,
    "22 avril - Plat principal": document.querySelector('input[name="main-22"]:checked').value,
    "22 avril - Dessert": document.querySelector('input[name="dessert-22"]:checked').value,
    "23 avril - Plat principal": document.querySelector('input[name="main-23"]:checked').value,
    "23 avril - Dessert": document.querySelector('input[name="dessert-23"]:checked').value,
    "24 avril - Plat principal": document.querySelector('input[name="main-24"]:checked').value,
    "24 avril - Dessert": document.querySelector('input[name="dessert-24"]:checked').value
  };
  
  // Créer un CSV
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // En-têtes
  const headers = Object.keys(choices);
  csvContent += headers.join(",") + "\r\n";
  
  // Valeurs
  const values = Object.values(choices).map(value => `"${value}"`);
  csvContent += values.join(",") + "\r\n";
  
  // Créer un lien de téléchargement
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `choix_menu_${studentLastname}_${studentFirstname}.csv`.replace(/\s+/g, '_'));
  document.body.appendChild(link);
  
  // Télécharger le fichier
  link.click();
  
  // Nettoyer
  document.body.removeChild(link);
});

// Ajouter des styles pour le tableau de récapitulatif et le message de confirmation
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
    }
    
    .summary-table th, .summary-table td {
      border: 1px solid #ddd;
      padding: 0.8rem;
      text-align: left;
    }
    
    .summary-table th {
      background-color: var(--secondary-color);
      color: white;
    }
    
    .summary-table tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    
    .confirmation-message {
      background-color: var(--success-color);
      color: white;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: bold;
    }
    
    .input-group {
      margin-bottom: 1rem;
    }
    
    .input-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: var(--primary-color);
    }
    
    .input-group input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
  `;
  document.head.appendChild(style);
});

// Copier le fichier JSON dans le répertoire du site web
document.addEventListener('DOMContentLoaded', function() {
  // Créer un objet avec les données du menu
  const menuOptions = {
    "22 avril": {
      "Plat principal": [
        "Lasagne, chips and salad",
        "Pasta bake, chips and salad",
        "Shepherds pie with seasonal mixed veg",
        "Chilli con carne with rice",
        "Chicken curry and rice",
        "Burgers, wedges and salad",
        "Fajita wraps, salsa and nachos",
        "Jacket potatoes and fillings"
      ],
      "Dessert": [
        "Banoffee pie",
        "White chocolate and raspberry brulee cheesecake",
        "Vanilla cheesecake",
        "Chocolate fudge cake",
        "Apple pie",
        "Lemon meringue pie",
        "Bakewell tart",
        "Tiramisu"
      ]
    },
    "23 avril": {
      "Plat principal": [
        "Lasagne, chips and salad",
        "Pasta bake, chips and salad",
        "Shepherds pie with seasonal mixed veg",
        "Chilli con carne with rice",
        "Chicken curry and rice",
        "Burgers, wedges and salad",
        "Fajita wraps, salsa and nachos",
        "Jacket potatoes and fillings"
      ],
      "Dessert": [
        "Banoffee pie",
        "White chocolate and raspberry brulee cheesecake",
        "Vanilla cheesecake",
        "Chocolate fudge cake",
        "Apple pie",
        "Lemon meringue pie",
        "Bakewell tart",
        "Tiramisu"
      ]
    },
    "24 avril": {
      "Plat principal": [
        "Lasagne, chips and salad",
        "Pasta bake, chips and salad",
        "Shepherds pie with seasonal mixed veg",
        "Chilli con carne with rice",
        "Chicken curry and rice",
        "Burgers, wedges and salad",
        "Fajita wraps, salsa and nachos",
        "Jacket potatoes and fillings"
      ],
      "Dessert": [
        "Banoffee pie",
        "White chocolate and raspberry brulee cheesecake",
        "Vanilla cheesecake",
        "Chocolate fudge cake",
        "Apple pie",
        "Lemon meringue pie",
        "Bakewell tart",
        "Tiramisu"
      ]
    }
  };
  
  // Stocker les données dans une variable globale
  menuData = menuOptions;
  
  // Remplir les options de menu
  populateMenuOptions();
});
