/* =========================
   CAREERTRACK - JAVASCRIPT
   Beginner-friendly version
========================= */

// Variable for storing the LocalStorage key.
var STORAGE_KEY = "careertrack_applications";

// Sample applications shown when the website is opened for the first time.
var demoData = [

    {
        id: "1",
        company: "Google",
        role: "Software Engineering Intern",
        location: "Bengaluru",
        status: "Interview",
        appliedDate: "2026-08-28",
        deadline: "2026-09-12",
        interviewDate: "2026-09-10T11:30",
        jobLink: "",
        notes: "Revise DSA and JavaScript fundamentals."
    },

    {
        id: "2",
        company: "Microsoft",
        role: "Software Engineering Intern",
        location: "Hyderabad",
        status: "Applied",
        appliedDate: "2026-09-01",
        deadline: "2026-09-18",
        interviewDate: "",
        jobLink: "",
        notes: "Application submitted."
    },

    {
        id: "3",
        company: "Atlassian",
        role: "Frontend Engineering Intern",
        location: "Remote",
        status: "Shortlisted",
        appliedDate: "2026-08-25",
        deadline: "2026-09-15",
        interviewDate: "",
        jobLink: "",
        notes: "Prepare DOM and web fundamentals."
    },

    {
        id: "4",
        company: "Adobe",
        role: "Product Intern",
        location: "Noida",
        status: "Offer",
        appliedDate: "2026-08-14",
        deadline: "2026-08-31",
        interviewDate: "",
        jobLink: "",
        notes: "Offer received."
    }

];


// Get saved applications from LocalStorage.
var savedData = localStorage.getItem(STORAGE_KEY);

var applications = [];

if (savedData != null) {

    try {
        applications = JSON.parse(savedData);
    }
    catch (error) {
        applications = demoData;
    }

} else {

    applications = demoData;

}


/* =========================
   UTILITY FUNCTIONS
========================= */

// This function protects text before displaying it inside HTML.
function escapeHTML(value) {

    var text = String(value || "");

    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/"/g, "&quot;");
    text = text.replace(/'/g, "&#039;");

    return text;
}


// Get the first letters of the company name.
function initials(company) {

    var words = company.trim().split(" ");
    var result = "";

    for (var i = 0; i < words.length && i < 2; i++) {

        if (words[i] != "") {
            result = result + words[i].charAt(0);
        }

    }

    return result.toUpperCase();
}


// Convert a date into a readable format.
function formatDate(value) {

    if (value == "" || value == null) {
        return "Not set";
    }

    var date = new Date(value);

    if (isNaN(date.getTime())) {
        return "Not set";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// Convert date and time into a readable format.
function formatDateTime(value) {

    if (value == "" || value == null) {
        return "Date not set";
    }

    var date = new Date(value);

    if (isNaN(date.getTime())) {
        return "Date not set";
    }

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit"
    });
}


// Save the application array in LocalStorage.
function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(applications)
    );

}


/* =========================
   NAVIGATION
========================= */

// Show the selected page.
function showPage(pageId, button) {

    var pages = document.getElementsByClassName("page");

    // Hide all pages.
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    }

    // Show the selected page.
    document.getElementById(pageId).classList.add("active");

    // Remove active class from all navigation buttons.
    var buttons = document.querySelectorAll(".nav button");

    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("active");
    }

    // Highlight the selected navigation button.
    if (button) {
        button.classList.add("active");
    } else {

        if (pageId == "dashboard") {
            buttons[0].classList.add("active");
        }

        if (pageId == "applications") {
            buttons[1].classList.add("active");
        }

        if (pageId == "interviews") {
            buttons[2].classList.add("active");
        }

        if (pageId == "insights") {
            buttons[3].classList.add("active");
        }
    }

    // Change the heading according to the page.
    var heading = document.getElementById("pageHeading");

    if (pageId == "dashboard") {
        heading.innerHTML = "Good luck with your next opportunity 👋";
    }

    else if (pageId == "applications") {
        heading.innerHTML = "Manage your application pipeline";
    }

    else if (pageId == "interviews") {
        heading.innerHTML = "Your interview schedule";
    }

    else if (pageId == "insights") {
        heading.innerHTML = "Your progress at a glance";
    }

}


/* =========================
   MODAL FUNCTIONS
========================= */

// Open the form for adding or editing an application.
function openModal(application) {

    var overlay = document.getElementById("modalOverlay");
    var form = document.getElementById("applicationForm");

    overlay.classList.add("show");

    document.body.style.overflow = "hidden";

    form.reset();

    document.getElementById("applicationId").value = "";

    // Set the modal heading.
    if (application == null) {
        document.getElementById("modalTitle").innerHTML = "Add a new application";
    } else {
        document.getElementById("modalTitle").innerHTML = "Edit application";
    }

    // Set today's date in the applied date field.
    var today = new Date().toISOString().slice(0, 10);

    document.getElementById("appliedDate").value = today;

    // If an application is selected, fill the form with its details.
    if (application != null) {

        document.getElementById("applicationId").value = application.id;
        document.getElementById("company").value = application.company;
        document.getElementById("role").value = application.role;
        document.getElementById("location").value = application.location || "";
        document.getElementById("status").value = application.status;
        document.getElementById("appliedDate").value = application.appliedDate || "";
        document.getElementById("deadline").value = application.deadline || "";
        document.getElementById("interviewDate").value = application.interviewDate || "";
        document.getElementById("jobLink").value = application.jobLink || "";
        document.getElementById("notes").value = application.notes || "";

    }

}


// Close the modal.
function closeModal() {

    document.getElementById("modalOverlay").classList.remove("show");

    document.body.style.overflow = "";

}


// Close the modal when the user clicks outside it.
function closeOnOutside(event) {

    if (event.target.id == "modalOverlay") {
        closeModal();
    }

}


/* =========================
   SAVE APPLICATION
========================= */

// Save a new application or update an existing one.
function saveApplication(event) {

    event.preventDefault();

    var id = document.getElementById("applicationId").value;

    // Create an application object using form values.
    var application = {

        id: id,

        company: document.getElementById("company").value.trim(),

        role: document.getElementById("role").value.trim(),

        location: document.getElementById("location").value.trim(),

        status: document.getElementById("status").value,

        appliedDate: document.getElementById("appliedDate").value,

        deadline: document.getElementById("deadline").value,

        interviewDate: document.getElementById("interviewDate").value,

        jobLink: document.getElementById("jobLink").value.trim(),

        notes: document.getElementById("notes").value.trim()

    };


    // If ID is empty, add a new application.
    if (id == "") {

        application.id = new Date().getTime().toString();

        applications.push(application);

        showToast("Application added");

    }

    // Otherwise, update the existing application.
    else {

        for (var i = 0; i < applications.length; i++) {

            if (applications[i].id == id) {
                applications[i] = application;
            }

        }

        showToast("Application updated");

    }

    saveData();

    closeModal();

    renderAll();

}


/* =========================
   DELETE APPLICATION
========================= */

// Delete an application using its ID.
function deleteApplication(id) {

    var companyName = "";

    for (var i = 0; i < applications.length; i++) {

        if (applications[i].id == id) {
            companyName = applications[i].company;
        }

    }

    if (confirm("Delete " + companyName + " application?")) {

        var newApplications = [];

        for (var j = 0; j < applications.length; j++) {

            if (applications[j].id != id) {
                newApplications.push(applications[j]);
            }

        }

        applications = newApplications;

        saveData();

        renderAll();

        showToast("Application deleted");

    }

}


/* =========================
   EDIT APPLICATION
========================= */

// Find an application and open it in the form.
function editApplication(id) {

    for (var i = 0; i < applications.length; i++) {

        if (applications[i].id == id) {
            openModal(applications[i]);
            return;
        }

    }

}


/* =========================
   APPLICATION CARD
========================= */

// Create the HTML for one application.
function applicationCard(app) {

    var html = "";

    html += '<div class="application">';

    html += '<div class="company">';

    html += '<div class="company-logo">';
    html += escapeHTML(initials(app.company));
    html += '</div>';

    html += '<div class="company-info">';

    html += '<strong>' + escapeHTML(app.company) + '</strong>';

    html += '<span>' + escapeHTML(app.role);

    if (app.location != "") {
        html += ' · ' + escapeHTML(app.location);
    }

    html += '</span>';

    html += '</div>';
    html += '</div>';

    html += '<div class="application-meta">';

    html += '<span class="badge ' + escapeHTML(app.status) + '">';
    html += escapeHTML(app.status);
    html += '</span>';

    html += '<small>';

    if (app.deadline != "") {
        html += 'Deadline: ' + formatDate(app.deadline);
    } else {
        html += 'Applied: ' + formatDate(app.appliedDate);
    }

    html += '</small>';

    html += '</div>';

    html += '<div class="row-actions">';

    html += '<button class="mini-btn" onclick="editApplication(\'' + app.id + '\')">Edit</button>';

    html += '<button class="mini-btn" onclick="deleteApplication(\'' + app.id + '\')">Delete</button>';

    html += '</div>';

    html += '</div>';

    return html;

}


/* =========================
   DASHBOARD
========================= */

// Display the statistics and information on the dashboard.
function renderDashboard() {

    var total = applications.length;
    var active = 0;
    var interviews = 0;
    var offers = 0;

    // Count applications according to their status.
    for (var i = 0; i < applications.length; i++) {

        if (applications[i].status == "Applied" ||
            applications[i].status == "Shortlisted") {
            active++;
        }

        if (applications[i].status == "Interview" ||
            applications[i].interviewDate != "") {
            interviews++;
        }

        if (applications[i].status == "Offer") {
            offers++;
        }

    }

    document.getElementById("totalApplications").innerHTML = total;

    document.getElementById("activeApplications").innerHTML = active;

    document.getElementById("totalInterviews").innerHTML = interviews;

    document.getElementById("totalOffers").innerHTML = offers;

    // Calculate response rate.
    var responseRate = 0;

    if (total > 0) {
        responseRate = Math.round((interviews + offers) / total * 100);
    }

    document.getElementById("responseRate").innerHTML = responseRate + "%";


    // Display recent applications.
    var recentHTML = "";
    var count = 0;

    for (var j = applications.length - 1; j >= 0 && count < 4; j--) {

        recentHTML += applicationCard(applications[j]);

        count++;

    }

    if (recentHTML == "") {
        recentHTML = '<div class="empty"><strong>No applications yet</strong>Add your first opportunity.</div>';
    }

    document.getElementById("recentApplications").innerHTML = recentHTML;


    // Create a list of upcoming dates.
    var events = [];
    var today = new Date();

    for (var k = 0; k < applications.length; k++) {

        var app = applications[k];

        if (app.interviewDate != "") {

            var interview = new Date(app.interviewDate);

            if (interview >= today) {

                var interviewEvent = {
                    date: interview,
                    title: app.company,
                    type: "Interview",
                    role: app.role
                };

                events.push(interviewEvent);

            }

        }

        if (app.deadline != "") {

            var deadlineDate = new Date(app.deadline + "T23:59");

            if (deadlineDate >= today) {

                var deadlineEvent = {
                    date: deadlineDate,
                    title: app.company,
                    type: "Deadline",
                    role: app.role
                };

                events.push(deadlineEvent);

            }

        }

    }


    // Arrange events by date using a simple sorting loop.
    for (var a = 0; a < events.length; a++) {

        for (var b = 0; b < events.length - 1; b++) {

            if (events[b].date > events[b + 1].date) {

                var temp = events[b];

                events[b] = events[b + 1];

                events[b + 1] = temp;

            }

        }

    }


    // Display the first five upcoming events.
    var dateHTML = "";

    for (var e = 0; e < events.length && e < 5; e++) {

        dateHTML += '<div class="timeline-item">';

        dateHTML += '<div class="date">';

        dateHTML += '<strong>' + events[e].date.getDate() + '</strong>';

        dateHTML += '<small>';
        dateHTML += events[e].date.toLocaleString("en-IN", { month: "short" });
        dateHTML += '</small>';

        dateHTML += '</div>';

        dateHTML += '<div>';

        dateHTML += '<strong>';
        dateHTML += escapeHTML(events[e].title) + ' · ' + events[e].type;
        dateHTML += '</strong>';

        dateHTML += '<p>' + escapeHTML(events[e].role) + '</p>';

        dateHTML += '</div>';

        dateHTML += '</div>';

    }

    if (dateHTML == "") {
        dateHTML = '<div class="empty"><strong>No upcoming dates</strong>Add deadlines or interviews.</div>';
    }

    document.getElementById("upcomingDates").innerHTML = dateHTML;


    // Display application status breakdown.
    var statuses = [
        "Wishlist",
        "Applied",
        "Shortlisted",
        "Interview",
        "Offer",
        "Rejected"
    ];

    var breakdownHTML = "";

    for (var s = 0; s < statuses.length; s++) {

        var statusCount = 0;

        for (var n = 0; n < applications.length; n++) {

            if (applications[n].status == statuses[s]) {
                statusCount++;
            }

        }

        var percentage = 0;

        if (total > 0) {
            percentage = statusCount / total * 100;
        }

        breakdownHTML += '<div class="break-row">';

        breakdownHTML += '<span>' + statuses[s] + '</span>';

        breakdownHTML += '<div class="progress">';
        breakdownHTML += '<i style="width:' + percentage + '%"></i>';
        breakdownHTML += '</div>';

        breakdownHTML += '<b>' + statusCount + '</b>';

        breakdownHTML += '</div>';

    }

    document.getElementById("statusBreakdown").innerHTML = breakdownHTML;

}
/* =========================
   APPLICATIONS PAGE
========================= */

// Display all applications with search, filter and sorting.
function renderApplications() {

    var search = document.getElementById("searchInput").value.toLowerCase();

    var filter = document.getElementById("statusFilter").value;

    var sort = document.getElementById("sortFilter").value;

    var list = [];


    // Search and filter applications.
    for (var i = 0; i < applications.length; i++) {

        var app = applications[i];

        var text = (
            app.company + " " +
            app.role + " " +
            app.location
        ).toLowerCase();

        var searchMatch = text.indexOf(search) != -1;

        var filterMatch = (filter == "all" || app.status == filter);

        if (searchMatch && filterMatch) {
            list.push(app);
        }

    }


    // Sort applications using simple loops.
    for (var a = 0; a < list.length; a++) {

        for (var b = 0; b < list.length - 1; b++) {

            var swap = false;

            if (sort == "newest") {

                if ((list[b].appliedDate || "") <
                    (list[b + 1].appliedDate || "")) {
                    swap = true;
                }

            }

            else if (sort == "deadline") {

                var date1 = list[b].deadline || "9999";
                var date2 = list[b + 1].deadline || "9999";

                if (date1 > date2) {
                    swap = true;
                }

            }

            else if (sort == "company") {

                if (list[b].company.toLowerCase() >
                    list[b + 1].company.toLowerCase()) {
                    swap = true;
                }

            }

            if (swap == true) {

                var temp = list[b];

                list[b] = list[b + 1];

                list[b + 1] = temp;

            }

        }

    }


    // Display the applications.
    var html = "";

    for (var j = 0; j < list.length; j++) {
        html += applicationCard(list[j]);
    }

    if (html == "") {
        html = '<div class="empty"><strong>No applications found</strong>Try changing your search or filter.</div>';
    }

    document.getElementById("allApplications").innerHTML = html;

}


/* =========================
   INTERVIEWS PAGE
========================= */

// Display applications that have an interview.
function renderInterviews() {

    var list = [];

    for (var i = 0; i < applications.length; i++) {

        if (applications[i].status == "Interview" ||
            applications[i].interviewDate != "") {

            list.push(applications[i]);

        }

    }


    // Arrange interviews by date.
    for (var a = 0; a < list.length; a++) {

        for (var b = 0; b < list.length - 1; b++) {

            var date1 = list[b].interviewDate || "9999";
            var date2 = list[b + 1].interviewDate || "9999";

            if (date1 > date2) {

                var temp = list[b];

                list[b] = list[b + 1];

                list[b + 1] = temp;

            }

        }

    }


    var html = "";

    for (var j = 0; j < list.length; j++) {

        var app = list[j];

        html += '<div class="interview-card">';

        html += '<span class="badge ' + escapeHTML(app.status) + '">';
        html += escapeHTML(app.status);
        html += '</span>';

        html += '<h3>' + escapeHTML(app.company) + '</h3>';

        html += '<div>' + escapeHTML(app.role) + '</div>';

        html += '<div class="date-text">';
        html += formatDateTime(app.interviewDate);
        html += '</div>';

        html += '<p>';

        if (app.notes != "") {
            html += escapeHTML(app.notes);
        } else {
            html += "No preparation notes yet.";
        }

        html += '</p>';

        html += '<button class="mini-btn" onclick="editApplication(\'' + app.id + '\')">';
        html += 'Edit details';
        html += '</button>';

        html += '</div>';

    }

    if (html == "") {
        html = '<div class="empty"><strong>No interviews yet</strong>Add an interview date to an application.</div>';
    }

    document.getElementById("interviewCards").innerHTML = html;

}


/* =========================
   INSIGHTS PAGE
========================= */

// Display the application funnel and career summary.
function renderInsights() {

    var stages = [
        "Applied",
        "Shortlisted",
        "Interview",
        "Offer"
    ];

    var counts = [0, 0, 0, 0];


    // Count applications for each stage.
    for (var i = 0; i < applications.length; i++) {

        var status = applications[i].status;

        if (status == "Applied" ||
            status == "Shortlisted" ||
            status == "Interview" ||
            status == "Offer") {
            counts[0]++;
        }

        if (status == "Shortlisted" ||
            status == "Interview" ||
            status == "Offer") {
            counts[1]++;
        }

        if (status == "Interview" ||
            status == "Offer" ||
            applications[i].interviewDate != "") {
            counts[2]++;
        }

        if (status == "Offer") {
            counts[3]++;
        }

    }


    // Find the highest count to calculate bar widths.
    var max = 1;

    for (var j = 0; j < counts.length; j++) {

        if (counts[j] > max) {
            max = counts[j];
        }

    }


    // Create the application funnel.
    var funnelHTML = "";

    for (var k = 0; k < stages.length; k++) {

        var width = counts[k] / max * 100;

        funnelHTML += '<div class="funnel-row">';

        funnelHTML += '<span>' + stages[k] + '</span>';

        funnelHTML += '<div class="funnel-bar">';
        funnelHTML += '<i style="width:' + width + '%"></i>';
        funnelHTML += '</div>';

        funnelHTML += '<b>' + counts[k] + '</b>';

        funnelHTML += '</div>';

    }

    document.getElementById("funnel").innerHTML = funnelHTML;


    // Calculate summary information.
    var total = applications.length;
    var offers = 0;
    var interviews = 0;

    for (var n = 0; n < applications.length; n++) {

        if (applications[n].status == "Offer") {
            offers++;
        }

        if (applications[n].status == "Interview" ||
            applications[n].interviewDate != "") {
            interviews++;
        }

    }

    var offerRate = 0;

    if (total > 0) {
        offerRate = Math.round(offers / total * 100);
    }


    // Display the summary.
    var snapshotHTML = "";

    snapshotHTML += '<div class="snapshot-row">';
    snapshotHTML += '<span>Total applications</span>';
    snapshotHTML += '<b>' + total + '</b>';
    snapshotHTML += '</div>';

    snapshotHTML += '<div class="snapshot-row">';
    snapshotHTML += '<span>Interviews</span>';
    snapshotHTML += '<b>' + interviews + '</b>';
    snapshotHTML += '</div>';

    snapshotHTML += '<div class="snapshot-row">';
    snapshotHTML += '<span>Offers</span>';
    snapshotHTML += '<b>' + offers + '</b>';
    snapshotHTML += '</div>';

    snapshotHTML += '<div class="snapshot-row">';
    snapshotHTML += '<span>Offer rate</span>';
    snapshotHTML += '<b>' + offerRate + '%</b>';
    snapshotHTML += '</div>';

    document.getElementById("snapshot").innerHTML = snapshotHTML;

}


/* =========================
   RENDER ALL PAGES
========================= */

// Refresh all pages after adding, editing or deleting data.
function renderAll() {

    renderDashboard();

    renderApplications();

    renderInterviews();

    renderInsights();

}


/* =========================
   DARK MODE
========================= */

// Turn dark mode on or off.
function toggleDarkMode() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("careertrack-dark", "true");

    } else {

        localStorage.setItem("careertrack-dark", "false");

    }

}


/* =========================
   EXPORT DATA
========================= */

// Download all application details as a JSON file.
function exportData() {

    var jsonData = JSON.stringify(applications, null, 2);

    var file = new Blob([jsonData], {
        type: "application/json"
    });

    var url = URL.createObjectURL(file);

    var link = document.createElement("a");

    link.href = url;

    link.download = "CareerTrack-Applications.json";

    link.click();

    URL.revokeObjectURL(url);

    showToast("Data exported successfully");

}


/* =========================
   TOAST MESSAGE
========================= */

// Show a small message after an action.
function showToast(message) {

    var toast = document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 1800);

}


/* =========================
   KEYBOARD EVENT
========================= */

// Close the modal when the Escape key is pressed.
document.addEventListener("keydown", function(event) {

    if (event.key == "Escape") {

        var modal = document.getElementById("modalOverlay");

        if (modal.classList.contains("show")) {
            closeModal();
        }

    }

});


/* =========================
   INITIALIZATION
========================= */

// Check whether dark mode was enabled earlier.
var darkMode = localStorage.getItem("careertrack-dark");

if (darkMode == "true") {
    document.body.classList.add("dark");
}

// Display all data when the website opens.
renderAll();
