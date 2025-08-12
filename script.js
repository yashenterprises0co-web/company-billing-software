// Admin config - add admin emails here
const adminEmails = ["admin@yashenterprises.com"];

// Language strings
const langStrings = {
  en: {
    createDocument: "Create Document",
    enterTitle: "Enter Title",
    enterContent: "Enter Content",
    contactNumber: "Contact Number (10 digits)",
    yourDocuments: "Your Documents",
    back: "Back",
    edit: "Edit",
    save: "Save",
    delete: "Delete",
    share: "Share",
    invalidContact: "Contact number must be 10 digits.",
    editNotAllowed: "Editing period expired. Only admin can edit.",
    deleteNotAllowed: "Deletion period expired. Only admin can delete.",
    documentDeleted: "Document deleted.",
    noDocuments: "No documents created yet.",
    selectLanguage: "Select Language",
  },
  hi: {
    createDocument: "दस्तावेज़ बनाएँ",
    enterTitle: "शीर्षक दर्ज करें",
    enterContent: "सामग्री दर्ज करें",
    contactNumber: "संपर्क नंबर (10 अंक)",
    yourDocuments: "आपके दस्तावेज़",
    back: "वापस",
    edit: "संपादित करें",
    save: "सहेजें",
    delete: "हटाएं",
    share: "साझा करें",
    invalidContact: "संपर्क नंबर 10 अंकों का होना चाहिए।",
    editNotAllowed: "संपादन अवधि समाप्त। केवल व्यवस्थापक संपादित कर सकते हैं।",
    deleteNotAllowed: "हटाने की अवधि समाप्त। केवल व्यवस्थापक हटा सकते हैं।",
    documentDeleted: "दस्तावेज़ हटा दिया गया।",
    noDocuments: "अभी तक कोई दस्तावेज़ नहीं बनाया गया।",
    selectLanguage: "भाषा चुनें",
  },
  mr: {
    createDocument: "दस्तऐवज तयार करा",
    enterTitle: "शीर्षक टाका",
    enterContent: "सामग्री टाका",
    contactNumber: "संपर्क नंबर (10 अंक)",
    yourDocuments: "तुमची दस्तऐवज",
    back: "मागे",
    edit: "संपादित करा",
    save: "जतन करा",
    delete: "हटवा",
    share: "शेअर करा",
    invalidContact: "संपर्क क्रमांक 10 अंकी असावा.",
    editNotAllowed: "संपादन कालावधी संपला. फक्त प्रशासक संपादित करू शकतो.",
    deleteNotAllowed: "हटवण्याचा कालावधी संपला. फक्त प्रशासक हटवू शकतो.",
    documentDeleted: "दस्तऐवज हटवले.",
    noDocuments: "अजून दस्तऐवज तयार केलेले नाहीत.",
    selectLanguage: "भाषा निवडा",
  }
};

let currentLang = "en";
const LANGUAGE_SELECT = document.getElementById("languageSelect");

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById("docTitle").placeholder = langStrings[lang].enterTitle;
  document.getElementById("docContent").placeholder = langStrings[lang].enterContent;
  document.getElementById("contactNumber").placeholder = langStrings[lang].contactNumber;
  document.querySelector("#createDocumentSection h2").textContent = langStrings[lang].createDocument;
  document.querySelector("#documentsListSection h2").textContent = langStrings[lang].yourDocuments;
  document.getElementById("backToListBtn").textContent = langStrings[lang].back;
  document.getElementById("editBtn").textContent = langStrings[lang].edit;
  document.getElementById("saveBtn").textContent = langStrings[lang].save;
  document.getElementById("deleteBtn").textContent = langStrings[lang].delete;
}
LANGUAGE_SELECT.addEventListener("change", (e) => {
  setLanguage(e.target.value);
});

setLanguage(currentLang);

const createBtn = document.getElementById("createBtn");
const docTitle = document.getElementById("docTitle");
const docContent = document.getElementById("docContent");
const contactNumberInput = document.getElementById("contactNumber");
const imageUpload = document.getElementById("imageUpload");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");

const documentsList = document.getElementById("documentsList");
const documentViewSection = document.getElementById("documentViewSection");
const createDocumentSection = document.getElementById("createDocumentSection");
const documentsListSection = document.getElementById("documentsListSection");

const backToListBtn = document.getElementById("backToListBtn");
const viewDocTitle = document.getElementById("viewDocTitle");
const viewDocContent = document.getElementById("viewDocContent");
const viewImagesContainer = document.getElementById("viewImagesContainer");
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const shareButtons = document.getElementById("shareButtons");
const exportJSONBtn = document.getElementById("exportJSONBtn");
const exportCSVBtn = document.getElementById("exportCSVBtn");
const exportPDFBtn = document.getElementById("exportPDFBtn");

let documents = [];
let currentDocId = null;
let isEditing = false;

// Simulate getting current user email for demo; replace with real auth in deployment
function getCurrentUserEmail() {
  return "user@yashenterprises.com"; 
}

// Check if current user is admin
function isAdmin() {
  const userEmail = getCurrentUserEmail();
  return adminEmails.includes(userEmail.toLowerCase());
}

// Save documents to localStorage
function saveDocuments() {
  localStorage.setItem("documents", JSON.stringify(documents));
}

// Load documents from localStorage
function loadDocuments() {
  const stored = localStorage.getItem("documents");
  if (stored) {
    documents = JSON.parse(stored);
  } else {
    documents = [];
  }
}

// Render documents list
function renderDocumentsList() {
  documentsList.innerHTML = "";
  if (documents.length === 0) {
    documentsList.textContent = langStrings[currentLang].noDocuments;
    return;
  }
  documents.forEach((doc) => {
    const div = document.createElement("div");
    div.textContent = doc.title + " (" + new Date(doc.createdAt).toLocaleString() + ")";
    div.addEventListener("click", () => openDocument(doc.id));
    documentsList.appendChild(div);
  });
}

// Open document for view/edit
function openDocument(id) {
  currentDocId = id;
  const doc = documents.find(d => d.id === id);
  if (!doc) return;
  createDocumentSection.style.display = "none";
  documentsListSection.style.display = "none";
  documentViewSection.style.display = "block";
  viewDocTitle.textContent = doc.title;
  viewDocContent.textContent = doc.content;
  viewImagesContainer.innerHTML = "";
  if (doc.images && doc.images.length) {
    doc.images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      viewImagesContainer.appendChild(img);
    });
  }
  setViewButtons(doc);
  createShareButtons(doc);
  isEditing = false;
  toggleEditing(false);
}

// Enable/disable editing in view mode
function toggleEditing(enabled) {
  isEditing = enabled;
  const doc = documents.find(d => d.id === currentDocId);
  if (!doc) return;

  if (enabled) {
    viewDocTitle.innerHTML = `<input type="text" id="editTitle" value="${escapeHtml(doc.title)}" />`;
    viewDocContent.innerHTML = `<textarea id="editContent">${escapeHtml(doc.content)}</textarea>`;
    saveBtn.style.display = "inline-block";
    editBtn.style.display = "none";
    deleteBtn.style.display = "none";
  } else {
    viewDocTitle.textContent = doc.title;
    viewDocContent.textContent = doc.content;
    saveBtn.style.display = "none";
    editBtn.style.display = "inline-block";
    deleteBtn.style.display = "inline-block";
  }
}

// Escape HTML to avoid XSS
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function (m) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

// Show/hide edit/delete based on permissions & time
function setViewButtons(doc) {
  const now = Date.now();
  const createdAt = doc.createdAt;
  const elapsed = now - createdAt;
  const hours24 = 24 * 60 * 60 * 1000;

  if (elapsed > hours24) {
    if (isAdmin()) {
      editBtn.style.display = "inline-block";
      deleteBtn.style.display = "inline-block";
    } else {
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";
    }
  } else {
    if (getCurrentUserEmail() === doc.createdBy) {
      editBtn.style.display = "inline-block";
      deleteBtn.style.display = "inline-block";
    } else if (isAdmin()) {
      editBtn.style.display = "inline-block";
      deleteBtn.style.display = "inline-block";
    } else {
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";
    }
  }
}

// Create document event
createBtn.addEventListener("click", () => {
  const title = docTitle.value.trim();
  const content = docContent.value.trim();
  const contactNum = contactNumberInput.value.trim();
  if (!title || !content) {
    alert("Title and Content are required.");
    return;
  }
  if (!/^[0-9]{10}$/.test(contactNum)) {
    alert(langStrings[currentLang].invalidContact);
    return;
  }
  const id = Date.now();
  const createdBy = getCurrentUserEmail();
  const createdAt = Date.now();
  const images = [];

  const files = imageUpload.files;
  if (files.length > 0) {
    let loadedCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = function(e) {
        images.push(e.target.result);
        loadedCount++;
        if (loadedCount === files.length) {
          saveDoc();
        }
      };
      reader.readAsDataURL(file);
    }
  } else {
    saveDoc();
  }

  function saveDoc() {
    documents.push({id, title, content, contactNum, images, createdBy, createdAt});
    saveDocuments();
    renderDocumentsList();
    clearCreateForm();
  }
});

// Clear form inputs
function clearCreateForm() {
  docTitle.value = "";
  docContent.value = "";
  contactNumberInput.value = "";
  imageUpload.value = "";
  imagePreviewContainer.innerHTML = "";
}

// Image preview
imageUpload.addEventListener("change", () => {
  imagePreviewContainer.innerHTML = "";
  const files = imageUpload.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      imagePreviewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

// Back button event
backToListBtn.addEventListener("click", () => {
  documentViewSection.style.display = "none";
  createDocumentSection.style.display = "block";
  documentsListSection.style.display = "block";
  currentDocId = null;
  isEditing = false;
  renderDocumentsList();
});

// Edit button event
editBtn.addEventListener("click", () => {
  const doc = documents.find(d => d.id === currentDocId);
  if (!doc) return;
  const now = Date.now();
  if (now - doc.createdAt > 24*60*60*1000 && !isAdmin()) {
    alert(langStrings[currentLang].editNotAllowed);
    return;
  }
  toggleEditing(true);
});

// Save button event
saveBtn.addEventListener("click", () => {
  const titleInput = document.getElementById("editTitle");
  const contentInput = document.getElementById("editContent");
  if (!titleInput.value.trim() || !contentInput.value.trim()) {
    alert("Title and Content cannot be empty.");
    return;
  }
  const docIndex = documents.findIndex(d => d.id === currentDocId);
  if (docIndex < 0) return;
  documents[docIndex].title = titleInput.value.trim();
  documents[docIndex].content = contentInput.value.trim();
  saveDocuments();
  toggleEditing(false);
  renderDocumentsList();
});

// Delete button event
deleteBtn.addEventListener("click", () => {
  const docIndex = documents.findIndex(d => d.id === currentDocId);
  if (docIndex < 0) return;
  const doc = documents[docIndex];
  const now = Date.now();
  if (now - doc.createdAt > 24*60*60*1000 && !isAdmin()) {
    alert(langStrings[currentLang].deleteNotAllowed);
    return;
  }
  if (confirm("Are you sure you want to delete this document?")) {
    documents.splice(docIndex, 1);
    saveDocuments();
    alert(langStrings[currentLang].documentDeleted);
    backToListBtn.click();
  }
});

// Share buttons
function createShareButtons(doc) {
  shareButtons.innerHTML = "";
  const url = window.location.href.split("#")[0] + "#doc=" + doc.id;
  const btns = [
    {name: "Copy Link", action: () => {navigator.clipboard.writeText(url).then(() => alert("Link copied!"));}},
    {name: "WhatsApp", action: () => {window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");}},
    {name: "Email", action: () => {window.location.href = `mailto:?subject=${encodeURIComponent(doc.title)}&body=${encodeURIComponent(url)}`;}},
    {name: "Facebook", action: () => {window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");}},
    {name: "Twitter", action: () => {window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, "_blank");}},
  ];
  btns.forEach(b => {
    const button = document.createElement("button");
    button.textContent = b.name;
    button.addEventListener("click", b.action);
    shareButtons.appendChild(button);
  });
}

// Export JSON
exportJSONBtn.addEventListener("click", () => {
  const dataStr = JSON.stringify(documents, null, 2);
  const blob = new Blob([dataStr], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "documents.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Export CSV
exportCSVBtn.addEventListener("click", () => {
  if (documents.length === 0) {
    alert("No documents to export");
    return;
  }
  let csv = "ID,Title,Content,Contact Number,Created By,Created At\\n";
  documents.forEach(d => {
    // Escape commas by wrapping in quotes
    const line = [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.content.replace(/"/g, '""')}"`,
      d.contactNum,
      d.createdBy,
      new Date(d.createdAt).toISOString()
    ].join(",");
    csv += line + "\\n";
  });
  const blob = new Blob([csv], {type: "text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "documents.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// Export PDF using jsPDF (must include jsPDF lib via CDN or local file)
// You can add <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script> in your html head
exportPDFBtn.addEventListener("click", () => {
  if (documents.length === 0) {
    alert("No documents to export");
    return;
  }
  if (!window.jspdf) {
    alert("PDF export library not loaded.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  documents.forEach(d => {
    doc.setFontSize(14);
    doc.text(`Title: ${d.title}`, 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Content: ${d.content}`, 10, y);
    y += 10;
    doc.text(`Contact: ${d.contactNum}`, 10, y);
    y += 10;
    doc.text(`Created By: ${d.createdBy}`, 10, y);
    y += 10;
    doc.text(`Created At: ${new Date(d.createdAt).toLocaleString()}`, 10, y);
    y += 20;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("documents.pdf");
});

// Load saved docs on page load
loadDocuments();
renderDocumentsList();

// Load document from URL hash if present
function checkHash() {
  const hash = window.location.hash;
  if (hash.startsWith("#doc=")) {
    const id = parseInt(hash.replace("#doc=", ""));
    if (!isNaN(id)) openDocument(id);
  }
}
window.addEventListener("load", checkHash);
window.addEventListener("hashchange", checkHash);
