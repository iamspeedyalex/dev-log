let entries = JSON.parse(localStorage.getItem('devlog-entries')) || [
  {
    id: 1,
    date: '2026-02-05',
    title: 'React State Management',
    tags: ['React', 'Hooks'],
    preview: 'Learned useState and useEffect patterns...',
    content: 'Today I dove deep into React state management using hooks.\n\n• useState for local component state\n• useEffect for side effects and lifecycle\n• Custom hooks for reusable logic\n\nBuilt a counter app and a todo list to practice.',
    mood: '🚀'
  },
  {
    id: 2,
    date: '2026-02-04',
    title: 'CSS Grid Deep Dive',
    tags: ['CSS', 'Layout'],
    preview: 'Finally understanding grid-template-areas...',
    content: 'CSS Grid is incredibly powerful. Today\'s focus:\n\n• grid-template-columns/rows\n• fr units and minmax()\n• grid-template-areas for semantic layouts\n\nThe "areas" syntax is like ASCII art for layouts. Mind blown.',
    mood: '💡'
  },
  {
    id: 3,
    date: '2026-02-03',
    title: 'Git Branching Strategy',
    tags: ['Git', 'Workflow'],
    preview: 'Implemented feature branch workflow...',
    content: 'Practiced Git branching strategies today:\n\n• Feature branches for isolation\n• Rebasing vs merging debates\n• Interactive rebase for clean history\n\nMade several mistakes and had to reset --hard. Learning experience!',
    mood: '🌿'
  }
];

function saveEntries() {
  localStorage.setItem('devlog-entries', JSON.stringify(entries));
}

let editingId = null;

function openEditModal(entry) {
  editingId = entry.id;
  document.getElementById('formTitle').value = entry.title;
  document.getElementById('formTags').value = entry.tags.join(', ');
  document.getElementById('formMood').value = entry.mood;
  document.getElementById('formContent').value = entry.content;
  document.querySelector('.modal-title').textContent = 'Edit Log Entry';
  modalOverlay.classList.add('active');
}

let currentIndex = 0;

function renderCard() {
  const entry = entries[currentIndex];
  const container = document.querySelector('.container');
  
  container.innerHTML = `
    <div class="card" data-id="${entry.id}">
      <div class="card-header">
        <span class="mood">${entry.mood}</span>
        <svg class="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span class="date">${entry.date}</span>
      </div>
      <h2 class="title">${entry.title}</h2>
      <div class="tags">
        ${entry.tags.map(tag => `
          <span class="tag">
            <svg class="tag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            ${tag}
          </span>
        `).join('')}
      </div>
      <p class="preview">${entry.preview}</p>
      <div class="content">${entry.content}</div>
      <div class="expand-hint">tap to expand</div>
      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    </div>
  `;
  
  const card = document.querySelector('.card');
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
    document.body.classList.toggle('card-expanded', card.classList.contains('expanded'));
});

  const editBtn = document.querySelector('.edit-btn');
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openEditModal(entry);
  });

  const deleteBtn = document.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Delete this entry?')) {
        entries.splice(currentIndex, 1);
        saveEntries();
        if (currentIndex >= entries.length) {
            currentIndex = entries.length -1;
        }
        renderCard();
        updateUI();
    }
  });
}

function renderDots() {
  const dotsContainer = document.getElementById('dots');
  
  // Only create dots once
  if (dotsContainer.children.length !== entries.length) {
    dotsContainer.innerHTML = entries.map((_, idx) => 
      `<button class="dot" data-index="${idx}"></button>`
    ).join('');
    
    dotsContainer.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.dataset.index);
        renderCard();
        updateUI();
      });
    });
  }
  
  // Update active state on existing dots
  dotsContainer.querySelectorAll('.dot').forEach((dot, idx) => {
    if (idx === currentIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function updateCounter() {
  document.getElementById('currentNum').textContent = String(currentIndex + 1).padStart(2, '0');
  document.getElementById('totalNum').textContent = String(entries.length).padStart(2, '0');
}

function updateUI() {
  renderDots();
  updateCounter();
}

document.getElementById('prevBtn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + entries.length) % entries.length;
  renderCard();
  updateUI();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % entries.length;
  renderCard();
  updateUI();
});

renderCard();
updateUI();

// Modal functionality
const modalOverlay = document.getElementById('modalOverlay');
const galleryOverlay = document.getElementById('galleryOverlay');
const galleryBtn = document.getElementById('galleryBtn');
const galleryGrid = document.getElementById('galleryGrid');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const entryForm = document.getElementById('entryForm');

addBtn.addEventListener('click', () => {
  modalOverlay.classList.add('active');
});

cancelBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  entryForm.reset();
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
    entryForm.reset();
  }
});

entryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const today = new Date().toISOString().split('T')[0];
  const title = document.getElementById('formTitle').value;
  const tagsInput = document.getElementById('formTags').value;
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];
  const mood = document.getElementById('formMood').value || '📝';
  const content = document.getElementById('formContent').value;
  const preview = content.slice(0, 60) + (content.length > 60 ? '...' : '');
  
  if (editingId) {
    const index = entries.findIndex(e => e.id === editingId);
    entries[index] = { ...entries[index], title, tags, mood, content, preview };
    editingId = null;
  } else {
    const newEntry = {
      id: Date.now(),
      date: today,
      title,
      tags,
      preview,
      content,
      mood
    };
    entries.unshift(newEntry);
    currentIndex = 0;
  }
  
  saveEntries();
  renderCard();
  updateUI();
  
  document.querySelector('.modal-title').textContent = 'New Log Entry';
  modalOverlay.classList.remove('active');
  entryForm.reset();
});

document.addEventListener('click', (e) => {
  const card = document.querySelector('.card');
  if (card && card.classList.contains('expanded') && !card.contains(e.target)) {
    card.classList.remove('expanded');
    document.body.classList.remove('card-expanded');
  }
});

document.addEventListener('keydown', (e) => {
  if (modalOverlay.classList.contains('active')) return;
  
  if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + entries.length) % entries.length;
    renderCard();
    updateUI();
  } else if (e.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % entries.length;
    renderCard();
    updateUI();
  }
});

galleryBtn.addEventListener('click', () => {
  renderGallery();
  galleryOverlay.classList.add('active');
});

galleryOverlay.addEventListener('click', (e) => {
  if (e.target === galleryOverlay) {
    galleryOverlay.classList.remove('active');
  }
});

function renderGallery() {
  galleryGrid.innerHTML = entries.map((entry, idx) => `
    <div class="gallery-item" data-index="${idx}">
      <span class="mood">${entry.mood}</span>
      <h3 class="title">${entry.title}</h3>
      <span class="date">${entry.date}</span>
    </div>
  `).join('');
  
  galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      currentIndex = parseInt(item.dataset.index);
      renderCard();
      updateUI();
      galleryOverlay.classList.remove('active');
    });
  });
}