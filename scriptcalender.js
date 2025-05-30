// DOM Elements
const appContainer = document.querySelector(".app-container")
const monthView = document.getElementById("month-view")
const weekView = document.getElementById("week-view")
const dayView = document.getElementById("day-view")
const monthGrid = document.getElementById("month-grid")
const weekHeader = document.getElementById("week-header")
const weekGrid = document.getElementById("week-grid")
const dayHeader = document.getElementById("day-header")
const dayGrid = document.getElementById("day-grid")
const currentDateElement = document.getElementById("current-date")
const currentViewElement = document.getElementById("current-view")
const todayBtn = document.getElementById("today-btn")
const prevBtn = document.getElementById("prev-btn")
const nextBtn = document.getElementById("next-btn")
const viewSelectorBtn = document.getElementById("view-selector-btn")
const viewDropdown = document.getElementById("view-dropdown")
const dropdownItems = document.querySelectorAll(".dropdown-item")
const themeToggle = document.getElementById("theme-toggle")
const themeIcon = document.getElementById("theme-icon")
const miniCalendarTitle = document.getElementById("mini-calendar-title")
const miniCalendarDays = document.getElementById("mini-calendar-days")
const miniPrevMonth = document.getElementById("mini-prev-month")
const miniNextMonth = document.getElementById("mini-next-month")
const createEventBtn = document.querySelector(".create-event-btn")
const eventModal = document.getElementById("event-modal")
const modalTitle = document.getElementById("modal-title")
const eventForm = document.getElementById("event-form")
const eventTitleInput = document.getElementById("event-title")
const eventDescriptionInput = document.getElementById("event-description")
const eventStartDateInput = document.getElementById("event-start-date")
const eventStartTimeInput = document.getElementById("event-start-time")
const eventEndDateInput = document.getElementById("event-end-date")
const eventEndTimeInput = document.getElementById("event-end-time")
const colorOptions = document.querySelectorAll(".color-option")
const saveBtn = document.getElementById("save-btn")
const cancelBtn = document.getElementById("cancel-btn")
const closeModalBtn = document.getElementById("close-modal")
const eventContextMenu = document.getElementById("event-context-menu")
const editEventBtn = document.getElementById("edit-event")
const deleteEventBtn = document.getElementById("delete-event")

// State
let currentDate = new Date()
let currentView = "month"
let events = JSON.parse(localStorage.getItem("calendar-events")) || []
let selectedEvent = null
let selectedColor = "#4285F4"
const miniCalendarDate = new Date()

// Initialize
function init() {
  loadEvents()
  renderCalendar()
  renderMiniCalendar()
  setupEventListeners()
  checkTheme()
}

// Load events from localStorage
function loadEvents() {
  const storedEvents = localStorage.getItem("calendar-events")
  if (storedEvents) {
    events = JSON.parse(storedEvents)
  }
}

// Save events to localStorage
function saveEvents() {
  localStorage.setItem("calendar-events", JSON.stringify(events))
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  todayBtn.addEventListener("click", goToToday)
  prevBtn.addEventListener("click", goToPrevious)
  nextBtn.addEventListener("click", goToNext)

  // View selector
  viewSelectorBtn.addEventListener("click", toggleViewDropdown)
  dropdownItems.forEach((item) => {
    item.addEventListener("click", changeView)
  })

  // Theme toggle
  themeToggle.addEventListener("click", toggleTheme)

  // Mini calendar
  miniPrevMonth.addEventListener("click", () => {
    miniCalendarDate.setMonth(miniCalendarDate.getMonth() - 1)
    renderMiniCalendar()
  })

  miniNextMonth.addEventListener("click", () => {
    miniCalendarDate.setMonth(miniCalendarDate.getMonth() + 1)
    renderMiniCalendar()
  })

  // Event modal
  createEventBtn.addEventListener("click", () => openEventModal())
  eventForm.addEventListener("submit", handleEventSubmit)
  cancelBtn.addEventListener("click", closeEventModal)
  closeModalBtn.addEventListener("click", closeEventModal)

  // Color options
  colorOptions.forEach((option) => {
    option.addEventListener("click", selectColor)
  })

  // Context menu
  document.addEventListener("click", hideContextMenu)
  editEventBtn.addEventListener("click", handleEditEvent)
  deleteEventBtn.addEventListener("click", handleDeleteEvent)

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!viewSelectorBtn.contains(e.target) && !viewDropdown.contains(e.target)) {
      viewDropdown.classList.remove("show")
    }
  })
}

// Check and set theme
function checkTheme() {
  const darkMode = localStorage.getItem("dark-mode") === "true"
  if (darkMode) {
    document.body.classList.add("dark-theme")
    themeIcon.textContent = "☀️"
  } else {
    document.body.classList.remove("dark-theme")
    themeIcon.textContent = "🌙"
  }
}

// Toggle theme
function toggleTheme() {
  const isDarkMode = document.body.classList.toggle("dark-theme")
  localStorage.setItem("dark-mode", isDarkMode)
  themeIcon.textContent = isDarkMode ? "☀️" : "🌙"
}

// Toggle view dropdown
function toggleViewDropdown() {
  viewDropdown.classList.toggle("show")
}

// Change view
function changeView(e) {
  const view = e.target.dataset.view
  currentView = view
  currentViewElement.textContent = view.charAt(0).toUpperCase() + view.slice(1)
  viewDropdown.classList.remove("show")
  renderCalendar()
}

// Go to today
function goToToday() {
  currentDate = new Date()
  renderCalendar()
}

// Go to previous period
function goToPrevious() {
  if (currentView === "day") {
    currentDate.setDate(currentDate.getDate() - 1)
  } else if (currentView === "week") {
    currentDate.setDate(currentDate.getDate() - 7)
  } else {
    currentDate.setMonth(currentDate.getMonth() - 1)
  }
  renderCalendar()
}

// Go to next period
function goToNext() {
  if (currentView === "day") {
    currentDate.setDate(currentDate.getDate() + 1)
  } else if (currentView === "week") {
    currentDate.setDate(currentDate.getDate() + 7)
  } else {
    currentDate.setMonth(currentDate.getMonth() + 1)
  }
  renderCalendar()
}

// Render calendar based on current view
function renderCalendar() {
  updateDateDisplay()

  // Hide all views
  monthView.classList.remove("active")
  weekView.classList.remove("active")
  dayView.classList.remove("active")

  // Show current view
  if (currentView === "month") {
    renderMonthView()
    monthView.classList.add("active")
  } else if (currentView === "week") {
    renderWeekView()
    weekView.classList.add("active")
  } else {
    renderDayView()
    dayView.classList.add("active")
  }
}

// Update date display in header
function updateDateDisplay() {
  const options = { month: "long", year: "numeric" }
  if (currentView === "day") {
    options.day = "numeric"
  }
  currentDateElement.textContent = currentDate.toLocaleDateString("en-US", options)
}

// Render mini calendar
function renderMiniCalendar() {
  // Update mini calendar title
  miniCalendarTitle.textContent = miniCalendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // Clear previous days
  miniCalendarDays.innerHTML = ""

  // Get first day of month and number of days
  const firstDay = new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth(), 1)
  const lastDay = new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth() + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Get day of week for first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay()

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const emptyDay = document.createElement("div")
    miniCalendarDays.appendChild(emptyDay)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div")
    dayElement.classList.add("mini-calendar-day")
    dayElement.textContent = day

    const dayDate = new Date(miniCalendarDate.getFullYear(), miniCalendarDate.getMonth(), day)

    // Check if this day is today
    if (dayDate.toDateString() === new Date().toDateString()) {
      dayElement.classList.add("today")
    }

    // Check if this day is selected
    if (dayDate.toDateString() === currentDate.toDateString()) {
      dayElement.classList.add("selected")
    }

    // Add click event
    dayElement.addEventListener("click", () => {
      currentDate = new Date(dayDate)
      renderCalendar()
      renderMiniCalendar()
    })

    miniCalendarDays.appendChild(dayElement)
  }
}

// Render month view
function renderMonthView() {
  // Clear grid
  monthGrid.innerHTML = ""

  // Get first day of month and number of days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Get day of week for first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay()

  // Get previous month's last day
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()

  // Add days from previous month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const day = prevMonthLastDay - firstDayOfWeek + i + 1
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day)
    addMonthDay(prevMonth, true)
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    addMonthDay(date, false)
  }

  // Add days from next month
  const totalDaysAdded = firstDayOfWeek + daysInMonth
  const nextMonthDays = 42 - totalDaysAdded // 6 rows of 7 days = 42

  for (let day = 1; day <= nextMonthDays; day++) {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
    addMonthDay(nextMonth, true)
  }
}

// Add a day to the month grid
function addMonthDay(date, isOtherMonth) {
  const dayElement = document.createElement("div")
  dayElement.classList.add("month-day")

  if (isOtherMonth) {
    dayElement.classList.add("other-month")
  }

  // Check if this day is today
  if (date.toDateString() === new Date().toDateString()) {
    dayElement.classList.add("today")
  }

  // Add day number
  const dayNumber = document.createElement("div")
  dayNumber.classList.add("day-number")
  dayNumber.textContent = date.getDate()
  dayElement.appendChild(dayNumber)

  // Add button to create event
  const addButton = document.createElement("button")
  addButton.classList.add("btn", "btn-icon", "add-event-btn")
  addButton.innerHTML = '<span class="icon">+</span>'
  addButton.addEventListener("click", (e) => {
    e.stopPropagation()
    openEventModal(date)
  })
  dayElement.appendChild(addButton)

  // Add events container
  const eventsContainer = document.createElement("div")
  eventsContainer.classList.add("day-events")

  // Get events for this day
  const dayEvents = getEventsForDate(date)

  // Display up to 3 events
  const maxEvents = 3
  const displayEvents = dayEvents.slice(0, maxEvents)

  displayEvents.forEach((event) => {
    const eventElement = createEventElement(event, "month")
    eventsContainer.appendChild(eventElement)
  })

  // Add "more" indicator if there are more events
  if (dayEvents.length > maxEvents) {
    const moreElement = document.createElement("div")
    moreElement.classList.add("more-events")
    moreElement.textContent = `+ ${dayEvents.length - maxEvents} more`
    eventsContainer.appendChild(moreElement)
  }

  dayElement.appendChild(eventsContainer)
  monthGrid.appendChild(dayElement)
}

// Render week view
function renderWeekView() {
  // Clear header and grid
  weekHeader.innerHTML = ""
  weekGrid.innerHTML = ""

  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

  // Create time column header
  const timeHeader = document.createElement("div")
  timeHeader.classList.add("week-header-cell")
  weekHeader.appendChild(timeHeader)

  // Create day headers
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)

    const dayHeader = document.createElement("div")
    dayHeader.classList.add("week-header-cell")

    const dayName = document.createElement("div")
    dayName.classList.add("week-day-name")
    dayName.textContent = day.toLocaleDateString("en-US", { weekday: "short" })

    const dayNumber = document.createElement("div")
    dayNumber.classList.add("week-day-number")
    dayNumber.textContent = day.getDate()

    // Check if this day is today
    if (day.toDateString() === new Date().toDateString()) {
      dayNumber.classList.add("today")
    }

    dayHeader.appendChild(dayName)
    dayHeader.appendChild(dayNumber)
    weekHeader.appendChild(dayHeader)
  }

  // Create time column
  const timeColumn = document.createElement("div")
  timeColumn.classList.add("time-column")

  // Create day columns
  const dayColumns = []
  for (let i = 0; i < 7; i++) {
    const dayColumn = document.createElement("div")
    dayColumn.classList.add("week-column")
    dayColumns.push(dayColumn)
  }

  // Create hour cells (5am to 11pm)
  for (let hour = 5; hour <= 23; hour++) {
    // Time cell
    const timeCell = document.createElement("div")
    timeCell.classList.add("time-cell")

    const timeLabel = document.createElement("div")
    timeLabel.classList.add("time-label")
    timeLabel.textContent = formatHour(hour)

    timeCell.appendChild(timeLabel)
    timeColumn.appendChild(timeCell)

    // Hour cells for each day
    for (let day = 0; day < 7; day++) {
      const hourCell = document.createElement("div")
      hourCell.classList.add("hour-cell")

      // Get date for this cell
      const cellDate = new Date(startOfWeek)
      cellDate.setDate(startOfWeek.getDate() + day)
      cellDate.setHours(hour, 0, 0, 0)

      // Add events for this hour
      const hourEvents = getEventsForHour(cellDate)
      hourEvents.forEach((event) => {
        const eventElement = createEventElement(event, "week")
        hourCell.appendChild(eventElement)
      })

      // Add click event to create new event
      hourCell.addEventListener("click", () => {
        openEventModal(cellDate)
      })

      dayColumns[day].appendChild(hourCell)
    }
  }

  // Add columns to grid
  weekGrid.appendChild(timeColumn)
  dayColumns.forEach((column) => {
    weekGrid.appendChild(column)
  })
}

// Render day view
function renderDayView() {
  // Clear header and grid
  dayHeader.innerHTML = ""
  dayGrid.innerHTML = ""

  // Set header
  dayHeader.textContent = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  // Create time column
  const timeColumn = document.createElement("div")
  timeColumn.classList.add("time-column")

  // Create day column
  const dayColumn = document.createElement("div")
  dayColumn.classList.add("week-column")

  // Create hour cells (5am to 11pm)
  for (let hour = 5; hour <= 23; hour++) {
    // Time cell
    const timeCell = document.createElement("div")
    timeCell.classList.add("time-cell")

    const timeLabel = document.createElement("div")
    timeLabel.classList.add("time-label")
    timeLabel.textContent = formatHour(hour)

    timeCell.appendChild(timeLabel)
    timeColumn.appendChild(timeCell)

    // Hour cell
    const hourCell = document.createElement("div")
    hourCell.classList.add("hour-cell")

    // Get date for this cell
    const cellDate = new Date(currentDate)
    cellDate.setHours(hour, 0, 0, 0)

    // Add events for this hour
    const hourEvents = getEventsForHour(cellDate)
    hourEvents.forEach((event) => {
      const eventElement = createEventElement(event, "day")
      hourCell.appendChild(eventElement)
    })

    // Add click event to create new event
    hourCell.addEventListener("click", () => {
      openEventModal(cellDate)
    })

    dayColumn.appendChild(hourCell)
  }

  // Add columns to grid
  dayGrid.appendChild(timeColumn)
  dayGrid.appendChild(dayColumn)
}

// Format hour (5 -> 5 AM, 13 -> 1 PM)
function formatHour(hour) {
  if (hour === 0) return "12 AM"
  if (hour === 12) return "12 PM"
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
}

// Get events for a specific date
function getEventsForDate(date) {
  return events.filter((event) => {
    const eventDate = new Date(event.start)
    return eventDate.toDateString() === date.toDateString()
  })
}

// Get events for a specific hour
function getEventsForHour(date) {
  return events.filter((event) => {
    const eventDate = new Date(event.start)
    return eventDate.toDateString() === date.toDateString() && eventDate.getHours() === date.getHours()
  })
}

// Create event element
function createEventElement(event, view) {
  const eventElement = document.createElement("div")
  eventElement.classList.add("event-card")
  eventElement.style.backgroundColor = `${event.color}20`
  eventElement.style.borderLeft = `3px solid ${event.color}`

  let content = ""

  if (view !== "month") {
    const startTime = new Date(event.start).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    content += `<span class="event-time">${startTime}</span> `
  }

  content += event.title
  eventElement.innerHTML = content

  // Add event listeners
  eventElement.addEventListener("click", (e) => {
    e.stopPropagation()
    openEventModal(null, event)
  })

  eventElement.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    showContextMenu(e, event)
  })

  return eventElement
}

// Open event modal
function openEventModal(date = null, event = null) {
  // Set modal title
  modalTitle.textContent = event ? "Edit Event" : "Create Event"

  // Set save button text
  saveBtn.textContent = event ? "Update" : "Create"

  // Store selected event
  selectedEvent = event

  // Reset form
  eventForm.reset()

  if (event) {
    // Populate form with event data
    eventTitleInput.value = event.title
    eventDescriptionInput.value = event.description || ""

    const start = new Date(event.start)
    const end = new Date(event.end)

    eventStartDateInput.value = formatDateForInput(start)
    eventStartTimeInput.value = formatTimeForInput(start)
    eventEndDateInput.value = formatDateForInput(end)
    eventEndTimeInput.value = formatTimeForInput(end)

    selectedColor = event.color
  } else {
    // Set default values
    const defaultDate = date || new Date()
    const defaultEndDate = new Date(defaultDate)
    defaultEndDate.setHours(defaultEndDate.getHours() + 1)

    eventStartDateInput.value = formatDateForInput(defaultDate)
    eventStartTimeInput.value = formatTimeForInput(defaultDate)
    eventEndDateInput.value = formatDateForInput(defaultEndDate)
    eventEndTimeInput.value = formatTimeForInput(defaultEndDate)

    selectedColor = "#4285F4"
  }

  // Update color selection
  updateColorSelection()

  // Show modal
  eventModal.classList.add("show")
}

// Close event modal
function closeEventModal() {
  eventModal.classList.remove("show")
  selectedEvent = null
}

// Format date for input (YYYY-MM-DD)
function formatDateForInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Format time for input (HH:MM)
function formatTimeForInput(date) {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

// Select color
function selectColor(e) {
  selectedColor = e.target.dataset.color
  updateColorSelection()
}

// Update color selection
function updateColorSelection() {
  colorOptions.forEach((option) => {
    if (option.dataset.color === selectedColor) {
      option.classList.add("selected")
    } else {
      option.classList.remove("selected")
    }
  })
}

// Handle event form submission
function handleEventSubmit(e) {
  e.preventDefault()

  // Combine date and time
  const start = new Date(`${eventStartDateInput.value}T${eventStartTimeInput.value}`)
  const end = new Date(`${eventEndDateInput.value}T${eventEndTimeInput.value}`)

  const newEvent = {
    id: selectedEvent ? selectedEvent.id : Date.now().toString(),
    title: eventTitleInput.value,
    description: eventDescriptionInput.value,
    start: start.toISOString(),
    end: end.toISOString(),
    color: selectedColor,
  }

  if (selectedEvent) {
    // Update existing event
    const index = events.findIndex((e) => e.id === selectedEvent.id)
    if (index !== -1) {
      events[index] = newEvent
    }
  } else {
    // Add new event
    events.push(newEvent)
  }

  // Save events
  saveEvents()

  // Close modal
  closeEventModal()

  // Refresh calendar
  renderCalendar()
}

// Show context menu
function showContextMenu(e, event) {
  // Set position
  eventContextMenu.style.left = `${e.pageX}px`
  eventContextMenu.style.top = `${e.pageY}px`

  // Store selected event
  selectedEvent = event

  // Show menu
  eventContextMenu.style.display = "block"
}

// Hide context menu
function hideContextMenu() {
  eventContextMenu.style.display = "none"
}

// Handle edit event from context menu
function handleEditEvent() {
  if (selectedEvent) {
    openEventModal(null, selectedEvent)
  }
  hideContextMenu()
}

// Handle delete event from context menu
function handleDeleteEvent() {
  if (selectedEvent) {
    const index = events.findIndex((e) => e.id === selectedEvent.id)
    if (index !== -1) {
      events.splice(index, 1)
      saveEvents()
      renderCalendar()
    }
  }
  hideContextMenu()
}

// Generate a UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Initialize the app
init()
