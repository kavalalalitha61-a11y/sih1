function startPortal(){
document.querySelector(".hero").style.display="none";
document.getElementById("portal").style.display="block";
document.getElementById("authStageHeading").style.display="block";
document.getElementById("authPanel").style.display="flex";
document.getElementById("resumeBuilderToggle").style.display="block";
document.getElementById("resumeBuilder").hidden=true;
document.getElementById("dashboard").style.display="none";
window.scrollTo({top:0,behavior:"smooth"});
}

function toggleResumeBuilder(){
const builder=document.getElementById("resumeBuilder");
const toggle=document.getElementById("resumeBuilderToggle");
builder.hidden=!builder.hidden;
toggle.innerText=builder.hidden?"Build Your Resume":"Close Resume Builder";
if(!builder.hidden) builder.scrollIntoView({behavior:"smooth",block:"start"});
}

let authMode="register";

function showAuth(mode){
authMode=mode;
const modal=document.getElementById("authModal");
modal.classList.add("show");
modal.setAttribute("aria-hidden","false");
updateAuthMode();
}

function closeAuth(){
const modal=document.getElementById("authModal");
modal.classList.remove("show");
modal.setAttribute("aria-hidden","true");
}

function switchAuthMode(){
authMode=authMode==="register"?"login":"register";
updateAuthMode();
}

function updateAuthMode(){
const registerForm=document.getElementById("registerForm");
const loginForm=document.getElementById("loginForm");
const authTitle=document.getElementById("authTitle");
const authSubtitle=document.getElementById("authSubtitle");
const authSwitch=document.getElementById("authSwitch");

registerForm.style.display=authMode==="register"?"block":"none";
loginForm.style.display=authMode==="login"?"block":"none";
authTitle.innerText=authMode==="register"?"Create your account":"Welcome back";
authSubtitle.innerText=authMode==="register"?"Enter your details to register as a student.":"Login to view your student opportunities.";
authSwitch.innerText=authMode==="register"?"Already registered? Login":"New student? Create an account";
}

function registerStudent(event){
event.preventDefault();
const password=document.getElementById("studentPassword").value;
const confirmPassword=document.getElementById("confirmPassword").value;
const error=document.getElementById("registerError");
const resume=document.getElementById("studentResume").files[0];

if(password!==confirmPassword){
error.innerText="Passwords do not match.";
return;
}

if(!resume){
error.innerText="Please upload your resume.";
return;
}

if(resume.size>5*1024*1024){
error.innerText="Resume must be smaller than 5 MB.";
return;
}

const student={
name:document.getElementById("studentName").value.trim(),
email:document.getElementById("studentEmail").value.trim().toLowerCase(),
phone:document.getElementById("studentPhone").value,
age:document.getElementById("studentAge").value,
password:password,
resumeName:resume.name,
resumeType:resume.type
};

const reader=new FileReader();
reader.onload=()=>{
student.resumePreview=reader.result;
localStorage.setItem("careerRouterStudent",JSON.stringify(student));
showLoggedInStudent(student);
closeAuth();
document.getElementById("registerForm").reset();
};
reader.readAsDataURL(resume);
}

function loginStudent(event){
event.preventDefault();
const error=document.getElementById("loginError");
const savedStudent=JSON.parse(localStorage.getItem("careerRouterStudent"));
const email=document.getElementById("loginEmail").value.trim().toLowerCase();
const password=document.getElementById("loginPassword").value;

if(!savedStudent||savedStudent.email!==email||savedStudent.password!==password){
error.innerText="Email or password is incorrect. Please register first if you are a new student.";
return;
}

showLoggedInStudent(savedStudent);
closeAuth();
document.getElementById("loginForm").reset();
}

function showLoggedInStudent(student){
document.getElementById("authStageHeading").style.display="none";
document.getElementById("authPanel").style.display="none";
document.getElementById("resumeBuilderToggle").style.display="none";
document.getElementById("resumeBuilder").hidden=true;
document.getElementById("dashboard").style.display="block";
document.getElementById("categoryContent").innerHTML="<p>Select a category above to continue.</p>";
document.getElementById("chatbot").classList.add("ready");
window.scrollTo({top:0,behavior:"smooth"});
}

function resumeFieldValue(id){
return document.getElementById(id).value.trim();
}

function escapeResumeText(value){
return value.replace(/[&<>"']/g,function(character){
return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[character];
});
}

function buildResume(event){
event.preventDefault();
const name=resumeFieldValue("resumeBuilderName");
const role=resumeFieldValue("resumeBuilderRole")||"Student";
const email=resumeFieldValue("resumeBuilderEmail");
const phone=resumeFieldValue("resumeBuilderPhone");
const education=resumeFieldValue("resumeBuilderEducation");
const skills=resumeFieldValue("resumeBuilderSkills");
const projects=resumeFieldValue("resumeBuilderProjects");
const summary=resumeFieldValue("resumeBuilderSummary");
const contact=[email,phone].filter(Boolean).map(escapeResumeText).join(" | ");
const preview=document.getElementById("resumePreview");

preview.innerHTML=`<div class="resume-document"><h3>${escapeResumeText(name)}</h3><p class="resume-role">${escapeResumeText(role)}</p><p class="resume-contact">${contact}</p>${summary?`<section><h4>Profile</h4><p>${escapeResumeText(summary)}</p></section>`:""}${education?`<section><h4>Education</h4><p>${escapeResumeText(education)}</p></section>`:""}${skills?`<section><h4>Skills</h4><p>${escapeResumeText(skills)}</p></section>`:""}${projects?`<section><h4>Projects / Experience</h4><p>${escapeResumeText(projects)}</p></section>`:""}<button class="resume-print-button" type="button" onclick="printResume()">Print / Save as PDF</button></div>`;
document.getElementById("resumeBuilderStatus").innerText="Resume preview created successfully.";
}

function printResume(){
window.print();
}

function toggleChatbot(){
document.getElementById("chatbot").classList.toggle("open");
}

function addChatMessage(text,type){
const messages=document.getElementById("chatMessages");
const message=document.createElement("div");
message.className=type+"-message";
message.textContent=text;
messages.appendChild(message);
messages.scrollTop=messages.scrollHeight;
}

function recommendationFor(query){
const text=query.toLowerCase();
const answers=[];
const stream=text.includes("mpc")||text.includes("science")?"MPC / Science":text.includes("bipc")||text.includes("biology")?"BiPC / Biology":text.includes("cec")||text.includes("commerce")?"CEC / Commerce":text.includes("hec")||text.includes("humanities")?"HEC / Humanities":"";
if(text.includes("scholar")) answers.push("Open Scholarships to compare government, private, tech and non-tech options. Keep income, caste, Aadhaar, marks, bonafide and bank documents ready.");
if(text.includes("intern")) answers.push("Open Internships. Tech students can start with TCS or Google; government-focused students can explore Skill India and MyGov. Keep a one-page resume and project links ready.");
if(text.includes("government")||text.includes("govt")||text.includes("job")) answers.push("Open Jobs and begin with SSC, RRB NTPC, Army or UPSC based on your qualification. Start with the syllabus, previous papers and mock tests.");
if(text.includes("higher")||text.includes("study")||text.includes("course")||text.includes("roadmap")) answers.push("Open Higher Studies and select your stream to see the visual roadmap from course selection to skills, internships and next steps.");
if(text.includes("resume")) answers.push("Your resume is collected during registration. Keep it to one page with education, skills, projects, certificates and contact details.");
if(stream) answers.push(`Since you mentioned ${stream}, Higher Studies will show the matching course and career roadmap.`);
if(!answers.length) return "I can relate your question to government jobs, private jobs, internships, scholarships, higher studies or resume preparation. Try mentioning your stream or goal, such as: MPC internships or scholarships after BiPC.";
return answers.join(" ");
}

function askRecommendation(query){
addChatMessage(query,"user");
addChatMessage(recommendationFor(query),"bot");
}

function sendChatMessage(event){
event.preventDefault();
const input=document.getElementById("chatInput");
const query=input.value.trim();
if(query){
askRecommendation(query);
input.value="";
}
}

function opportunityCard(name,meta,description,process){
const applyUrl=applyLinkFor(name);
return `<article class="detail-card"><h4>${name}</h4><span>${meta}</span><p>${description}</p><div class="card-actions"><button type="button" class="detail-btn" onclick="showDetail('${name}','${process}')">Application process</button><button type="button" class="material-btn" onclick="showMaterial('${name}','${process}')">Study material</button><a class="apply-btn" href="${applyUrl}" target="_blank" rel="noopener">Apply now ↗</a></div></article>`;
}

let lastDetail={name:"",process:""};

function showDetail(name,process){
lastDetail={name,process};
const materials=materialFor(name);
const applyUrl=applyLinkFor(name);
document.getElementById("categoryContent").innerHTML=`<div class="detail-view"><button type="button" class="back-btn" onclick="showCategory(lastCategory)">← Back to category</button><h3>${name}</h3><div class="process-box"><h4>Application process</h4><p>${process}</p></div><div class="material-box"><h4>Preparation material</h4><p>${materials}</p><button type="button" class="large-material-btn" onclick="showMaterial('${name}')">Open study material</button></div><a class="large-apply-btn" href="${applyUrl}" target="_blank" rel="noopener">Apply on official website ↗</a></div>`;
document.getElementById("categoryContent").scrollIntoView({behavior:"smooth",block:"start"});
}

function showMaterial(name,process=lastDetail.process){
lastDetail={name,process};
const materialUrl=materialLinkFor(name);
const materials=materialFor(name);
document.getElementById("categoryContent").innerHTML=`<div class="material-view"><button type="button" class="back-btn" onclick="showDetail(lastDetail.name,lastDetail.process)">← Back</button><span class="portal-kicker">STUDY MATERIAL</span><h3>${name}</h3><div class="material-reading"><h4>What to study</h4><p>${materials}</p><a class="large-material-btn" href="${materialUrl}" target="_blank" rel="noopener">Open official material ↗</a></div></div>`;
document.getElementById("categoryContent").scrollIntoView({behavior:"smooth",block:"start"});
}

function applyLinkFor(name){
if(name.includes("SSC")) return "https://ssc.gov.in";
if(name.includes("RRB")) return "https://indianrailways.gov.in";
if(name.includes("Army")) return "https://joinindianarmy.nic.in";
if(name.includes("UPSC")) return "https://upsc.gov.in";
if(name.includes("IBPS")) return "https://www.ibps.in";
if(name.includes("TCS")) return "https://www.tcs.com/careers";
if(name.includes("Google")) return "https://careers.google.com";
if(name.includes("Skill India")) return "https://www.skillindia.gov.in";
if(name.includes("MyGov")) return "https://www.mygov.in";
if(name.includes("National Fellowship")) return "https://tribal.nic.in/ScholarshiP.aspx";
if(name.includes("Top Class")) return "https://dbttribal.gov.in";
if(name.includes("Reliance")) return "https://www.reliancefoundation.org";
if(name.includes("Career Service")) return "https://www.ncs.gov.in";
return "https://www.ncs.gov.in";
}

function materialLinkFor(name){
if(name.includes("SSC")) return "https://ssc.gov.in/for-candidates";
if(name.includes("RRB")) return "https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,7,1281";
if(name.includes("Army")) return "https://joinindianarmy.nic.in";
if(name.includes("UPSC")||name.includes("PSC")) return "https://upsc.gov.in/examinations/active-examinations";
if(name.includes("IBPS")||name.includes("Banking")) return "https://www.ibps.in";
if(name.includes("TCS")||name.includes("Google")||name.includes("Coding")||name.includes("Tech")) return "https://www.freecodecamp.org/learn/";
if(name.includes("Skill India")) return "https://www.skillindiadigital.gov.in/home";
if(name.includes("MyGov")) return "https://www.mygov.in/";
if(name.includes("National Fellowship")) return "https://tribal.nic.in/ScholarshiP.aspx";
if(name.includes("Top Class")) return "https://dbttribal.gov.in";
if(name.includes("Reliance")) return "https://www.reliancefoundation.org";
return "https://www.ncs.gov.in/";
}

function materialFor(name){
if(name.includes("SSC")||name.includes("RRB")) return "Quantitative Aptitude, Reasoning, General Awareness, English, previous-year papers and timed mock tests.";
if(name.includes("Army")) return "General Knowledge, Current Affairs, Mathematics, Reasoning, physical fitness routine and previous recruitment papers.";
if(name.includes("UPSC")||name.includes("PSC")) return "NCERT textbooks, Indian Polity, History, Geography, Economy, Current Affairs, answer writing and mock tests.";
if(name.includes("IBPS")||name.includes("Banking")) return "Quantitative Aptitude, Reasoning, English, Banking Awareness, Computer Knowledge and sectional mock tests.";
if(name.includes("TCS")||name.includes("Google")||name.includes("Coding")||name.includes("Tech")) return "Programming fundamentals, data structures, Git, project portfolio, aptitude practice and role-specific interview questions.";
if(name.includes("Career Service")) return "Updated resume, communication skills, computer basics, role-specific skills and interview practice.";
if(name.includes("Skill India")||name.includes("MyGov")) return "Resume, communication, digital skills, basic project work and a short statement explaining your learning goals.";
return "Read the official syllabus or guidelines, collect required documents, practise relevant skills and use previous papers or sample tasks.";
}

let lastCategory="jobs";

function showCategory(category){
lastCategory=category;
const content=document.getElementById("categoryContent");
let html="";

if(category==="jobs"){
html=`<div class="category-result"><h3>💼 Jobs</h3><p class="result-intro">Choose a role to view eligibility and the application process.</p><h4 class="result-group">Government Jobs</h4><div class="detail-grid">${opportunityCard("SSC CHSL","12th Pass · ₹25,500/month","Staff selection roles in departments across India.","Check the notification at SSC → register online → upload documents → pay the fee if applicable → download the admit card.")}${opportunityCard("RRB NTPC","12th Pass / Graduate · Railway jobs","Clerical, commercial and traffic roles in Indian Railways.","Open the RRB notification → select your railway zone → complete the online form → upload photo and signature → attend CBT and later stages.")}${opportunityCard("Indian Army","10th/12th Pass · Defence jobs","Technical, general duty and other defence opportunities.","Check eligibility on Join Indian Army → create profile → submit the online application → attend physical, medical and written tests.")}${opportunityCard("UPSC Civil Services","Graduate · IAS / IPS / IFS","National-level civil services examination.","Read the UPSC notification → apply for Prelims → clear Prelims and Mains → attend the interview → complete service allocation.")}</div><h4 class="result-group">Private Jobs</h4><div class="detail-grid">${opportunityCard("National Career Service","Freshers and experienced candidates","Verified private openings across sectors.","Create an NCS profile → complete your resume → search by location and skill → apply on the employer page → attend the interview.")}${opportunityCard("TCS Careers","Graduate · IT and support roles","Technology, business and support opportunities.","Open the TCS careers page → choose a role → submit resume and details → complete the assessment → attend interviews.")}</div></div>`;
}

if(category==="internships"){
html=`<div class="category-result"><h3>🚀 Internships</h3><p class="result-intro">Build experience through government and private internships.</p><h4 class="result-group">Government Internships</h4><div class="detail-grid">${opportunityCard("Skill India Internship","Government · ₹12,000/month","Skill-based opportunities for students and freshers.","Create a profile on Skill India → choose a programme → submit education details → apply → complete selection and joining steps.")}${opportunityCard("MyGov Internship","Government · Flexible duration","Internships in policy, content, research and technology.","Visit the MyGov internship listing → review eligibility → submit resume and statement → wait for shortlisting → join the assigned project.")}</div><h4 class="result-group">Private Internships</h4><div class="detail-grid">${opportunityCard("TCS Internship","Private · ₹15,000/month","Technology and business learning opportunities.","Open TCS careers → select internship → submit application and resume → complete assessment → attend interview or selection round.")}${opportunityCard("Google Internship","Private · Remote options","Technology, design and business internships.","Search Google Careers internships → choose a team and location → submit resume → complete assessments → attend interviews.")}</div></div>`;
}

if(category==="scholarships"){
	html=`<div class="category-result"><h3>🎓 Scholarships</h3><p class="result-intro">Upload all required certificates to unlock scholarships matching your profile.</p><div class="scholarship-upload-panel"><h4>Required documents</h4><p class="upload-note">Upload Aadhaar, income, caste, marks, bonafide and bank passbook documents.</p><div class="document-grid"><label class="document-field">Aadhaar Card<input id="scholarAadhaar" type="file" accept=".pdf,.jpg,.jpeg,.png" required></label><label class="document-field">Income Certificate<input id="scholarIncome" type="file" accept=".pdf,.jpg,.jpeg,.png" required></label><label class="document-field">Caste Certificate<input id="scholarCaste" type="file" accept=".pdf,.jpg,.jpeg,.png" required></label><label class="document-field">Marks Memo<input id="scholarMarks" type="file" accept=".pdf,.jpg,.jpeg,.png" required></label><label class="document-field">Bonafide Certificate<input id="scholarBonafide" type="file" accept=".pdf,.jpg,.jpeg,.png" required></label><label class="document-field">Bank Passbook<input id="scholarBank" type="file" accept=".pdf,.jpg,.jpeg,.png" required></label></div><p class="upload-error" id="scholarUploadError" role="alert"></p><button type="button" class="auth-submit upload-button" onclick="unlockScholarships()">Upload and view scholarships</button></div><div id="scholarshipResults" class="scholarship-results"></div></div>`;
}

window.unlockScholarships=function(){
	const documentIds=["scholarAadhaar","scholarIncome","scholarCaste","scholarMarks","scholarBonafide","scholarBank"];
	const missing=documentIds.some(id=>!document.getElementById(id).files.length);
	const error=document.getElementById("scholarUploadError");
	if(missing){
		error.innerText="Please upload all six required documents before viewing scholarships.";
		return;
	}
	error.innerText="";
	document.getElementById("scholarshipResults").innerHTML=`<h4 class="result-group">Available Scholarships</h4><h4 class="result-subgroup">Government and Non-tech Scholarships</h4><div class="detail-grid">${opportunityCard("National Fellowship for ST","Up to ₹28,000/month · Higher education","Support for eligible ST students pursuing advanced studies.","Check the Tribal Affairs notification → register on the scholarship portal → upload caste, income and admission documents → submit for institute verification.")}${opportunityCard("Top Class Education Scheme","Up to ₹36,000/year · Education support","Financial support for eligible students in recognised institutions.","Check eligibility → complete the scholarship portal form → upload Aadhaar, income, caste and bonafide certificates → track institute and department verification.")}</div><h4 class="result-subgroup">Private Scholarships</h4><div class="detail-grid">${opportunityCard("Reliance Foundation Scholarship","Up to ₹2,00,000/year · Private","Private scholarship support for selected undergraduate students.","Register on the official foundation portal → complete application and assessment → submit academic and family details → wait for selection results.")}</div><h4 class="result-subgroup">Tech Scholarships</h4><div class="detail-grid">${opportunityCard("Women in Tech Scholarship","Technology · Tuition support","Scholarship opportunities for students building a career in technology.","Read the official eligibility → submit academic records, essay and income details → complete the assessment → wait for committee results.")}${opportunityCard("AI and Coding Scholarship","Tech learning · Course support","Support for students learning coding, AI and digital skills.","Choose the course → submit profile and motivation statement → complete the aptitude task if required → receive the award decision.")}</div>`;
	document.getElementById("scholarshipResults").scrollIntoView({behavior:"smooth",block:"start"});
}
if(category==="higher-opportunities"){
html=`<div class="category-result"><h3>📈 Higher Opportunities</h3><p class="result-intro">Prepare for competitive exams, fellowships and long-term career growth.</p><div class="detail-grid">${opportunityCard("SSC and Banking Exams","Government and banking careers","Structured routes for 12th-pass and graduate candidates.","Choose the exam → download the syllabus → prepare with previous papers and mock tests → apply during the notification window → attend each exam stage.")}${opportunityCard("UPSC and State PSC","Civil services and state administration","Long-term preparation path for public service careers.","Select the target service → study the official syllabus → build a current affairs plan → apply for the exam → clear Prelims, Mains and interview.")}${opportunityCard("Research Fellowships","Research · Monthly stipend","Opportunities for students planning research and higher education.","Check fellowship eligibility → prepare academic CV and proposal → submit documents before the deadline → attend interview or selection process.")}</div></div>`;
}

if(category==="volunteerships"){
html=`<div class="category-result"><h3>🤝 Volunteerships</h3><p class="result-intro">Part-time opportunities to learn, contribute and build your profile.</p><div class="detail-grid">${opportunityCard("Teach for Community","Part-time · 4-6 hours/week","Help school students with basic learning and digital skills.","Select a nearby centre → submit volunteer details → attend orientation → choose weekly time slots → submit activity updates.")}${opportunityCard("Digital Literacy Volunteer","Remote or local · Flexible","Support communities with online safety and digital access.","Register with the organisation → complete training → select a weekly slot → conduct sessions → record the work completed.")}${opportunityCard("Environment Volunteer","Weekend · Part-time","Join clean-up, plantation and awareness activities.","Choose an event → register with your contact details → attend the safety briefing → participate → receive a volunteer certificate when available.")}${opportunityCard("NGO Content Volunteer","Remote · 3-5 hours/week","Create social media, writing or design content for social causes.","Submit a sample or portfolio → attend a short orientation → choose tasks → share work for review → maintain the agreed weekly schedule.")}</div></div>`;
}

if(category==="higher-studies"){
html=`<div class="category-result"><h3>📚 Higher Studies Roadmap</h3><p class="result-intro">Select the stream you studied to see a starting roadmap.</p><div class="roadmap-form"><label for="studyStream">Your stream</label><select id="studyStream"><option value="MPC">MPC / Science</option><option value="BiPC">BiPC / Biology</option><option value="CEC">CEC / Commerce</option><option value="HEC">HEC / Humanities</option></select><button type="button" class="auth-submit" onclick="showRoadmap()">Show roadmap</button></div><div id="roadmapResult"></div></div>`;
}

content.innerHTML=html;
content.scrollIntoView({behavior:"smooth",block:"start"});
}

function showRoadmap(){
const stream=document.getElementById("studyStream").value;
const roadmaps={
MPC:["MPC / Science","B.Tech, B.Sc or BCA","Maths, coding and projects","Internships","Placements, GATE or M.Tech / MS"],
BiPC:["BiPC / Biology","MBBS, Nursing, Pharmacy or Biotechnology","Entrance and lab skills","Clinical or lab experience","Specialisation or research"],
CEC:["CEC / Commerce","B.Com, BBA, CA or Banking","Accounting and finance skills","Internships","Certification, placements or MBA"],
HEC:["HEC / Humanities","BA, Law, Journalism or Psychology","Communication and subject portfolio","Internships","Competitive exams, Masters or practice"]
};
const steps=roadmaps[stream];
document.getElementById("roadmapResult").innerHTML=`<div class="roadmap-result"><h4>${steps[0]} roadmap</h4><div class="flowchart">${steps.slice(1).map((step,index)=>`<div class="flow-step"><span>${index+1}</span><strong>${step}</strong></div>${index<steps.length-2?"<div class=\"flow-arrow\">↓</div>":""}`).join("")}</div></div>`;
}

function openPortal(type){

const q=document.getElementById("qual").value;
const g=document.getElementById("grp").value;

const modal=document.getElementById("modal");
const title=document.getElementById("mTitle");
const body=document.getElementById("mBody");

modal.classList.add("show");

let html="";

function card(name,info,extra,link){
return `
<div class="job-card">
<h3>${name}</h3>
<p>${info}</p>
<p>${extra}</p>
<a href="${link}" target="_blank" class="apply-btn">Explore</a>
</div>`;
}

/* ================= JOBS ================= */

if(type=="jobs"){

title.innerText="💼 Job Portal";

html+="<h2>Government Jobs</h2>";

html+=card("SSC CHSL","Salary: ₹25,500/month","12th Pass","https://ssc.gov.in");

html+=card("RRB NTPC","Salary: ₹28,000/month","12th Pass","https://indianrailways.gov.in");

html+=card("Indian Army","Salary: ₹30,000/month","10th/12th","https://joinindianarmy.nic.in");

html+="<h2>Private Jobs</h2>";

if(g=="MPC"){
html+=card("Software Engineer","₹6–18 LPA","Study: B.Tech CSE","https://ncs.gov.in");
html+=card("AI Engineer","₹8–20 LPA","AI & ML","https://ncs.gov.in");
html+=card("Data Scientist","₹8–22 LPA","Data Science","https://ncs.gov.in");
}

if(g=="BiPC"){
html+=card("Lab Technician","₹4–8 LPA","MLT","https://ncs.gov.in");
html+=card("Pharmacist","₹5–9 LPA","B.Pharmacy","https://ncs.gov.in");
html+=card("Nurse","₹5–10 LPA","B.Sc Nursing","https://ncs.gov.in");
}

if(g=="CEC"){
html+=card("Accountant","₹4–8 LPA","B.Com","https://ncs.gov.in");
html+=card("Financial Analyst","₹6–12 LPA","Finance","https://ncs.gov.in");
html+=card("Bank Executive","₹5–11 LPA","Banking","https://ncs.gov.in");
}

if(g=="HEC"){
html+=card("Content Writer","₹4–8 LPA","BA English","https://ncs.gov.in");
html+=card("Journalist","₹5–12 LPA","Journalism","https://ncs.gov.in");
html+=card("Lawyer","₹8–20 LPA","LLB","https://ncs.gov.in");
}

}

/* ================= SCHOLARSHIPS ================= */

if(type=="scholar"){

title.innerText="🎓 Scholarship Portal";

html=`
<h2>Eligibility Check</h2>

<input id="income" placeholder="Annual Family Income" class="box">

<button onclick="eligibility()">Check Eligibility</button>

<div id="eligibilityBox" style="display:none">

<h3>Required Documents</h3>

<ul>
<li>Aadhaar Card</li>
<li>ST Caste Certificate</li>
<li>Income Certificate</li>
<li>Bonafide Certificate</li>
<li>Marks Memo</li>
<li>Bank Passbook</li>
</ul>

<h3>Eligible Scholarships</h3>

<div id="scholarList"></div>

</div>
`;

}

/* ================= INTERNSHIPS ================= */

if(type=="intern"){

title.innerText="🚀 Internship Portal";

html+=card("Skill India Internship","₹12,000/month","Government","https://www.skillindia.gov.in");

html+=card("TCS Internship","₹15,000/month","Private","https://www.tcs.com/careers");

html+=card("Infosys Internship","₹18,000/month","Private","https://www.infosys.com");

html+=card("Google Internship","₹35,000/month","Remote","https://careers.google.com");

}

/* ================= HIGHER STUDIES ================= */

if(type=="study"){

title.innerText="📚 Higher Studies";

if(g=="MPC"){

html+=card("B.Tech Computer Science","4 Years","Software Engineer • ₹6–18 LPA","https://ncs.gov.in");
html+=card("Artificial Intelligence","4 Years","AI Engineer • ₹8–20 LPA","https://ncs.gov.in");
html+=card("Cyber Security","4 Years","Security Analyst","https://ncs.gov.in");
html+=card("Data Science","4 Years","Data Scientist","https://ncs.gov.in");
html+=card("Electronics & Communication","4 Years","ECE Engineer","https://ncs.gov.in");
html+=card("Mechanical Engineering","4 Years","Mechanical Engineer","https://ncs.gov.in");
html+=card("Civil Engineering","4 Years","Civil Engineer","https://ncs.gov.in");
html+=card("Commercial Pilot","3 Years","Pilot","https://ncs.gov.in");
html+=card("BCA","3 Years","Software Developer","https://ncs.gov.in");
html+=card("B.Sc Mathematics","3 Years","Data Analyst","https://ncs.gov.in");

}

else if(g=="BiPC"){

html+=card("MBBS","5.5 Years","Doctor","https://ncs.gov.in");
html+=card("BDS","5 Years","Dentist","https://ncs.gov.in");
html+=card("BAMS","5.5 Years","Ayurvedic Doctor","https://ncs.gov.in");
html+=card("BHMS","5.5 Years","Homeopathy Doctor","https://ncs.gov.in");
html+=card("Nursing","4 Years","Registered Nurse","https://ncs.gov.in");
html+=card("Pharmacy","4 Years","Pharmacist","https://ncs.gov.in");
html+=card("Physiotherapy","4.5 Years","Physiotherapist","https://ncs.gov.in");
html+=card("Biotechnology","4 Years","Scientist","https://ncs.gov.in");
html+=card("Nutrition","3 Years","Dietician","https://ncs.gov.in");
html+=card("Veterinary Science","5 Years","Veterinary Doctor","https://ncs.gov.in");

}

else if(g=="CEC"){

html+=card("B.Com","3 Years","Accountant","https://ncs.gov.in");
html+=card("CA","5 Years","Chartered Accountant","https://ncs.gov.in");
html+=card("CMA","4 Years","Cost Accountant","https://ncs.gov.in");
html+=card("Company Secretary","3 Years","CS","https://ncs.gov.in");
html+=card("BBA","3 Years","Business Manager","https://ncs.gov.in");
html+=card("Economics","3 Years","Economist","https://ncs.gov.in");
html+=card("Digital Marketing","1 Year","Marketing","https://ncs.gov.in");
html+=card("Banking & Finance","3 Years","Bank Officer","https://ncs.gov.in");
html+=card("Hotel Management","4 Years","Hotel Manager","https://ncs.gov.in");
html+=card("Retail Management","3 Years","Retail Manager","https://ncs.gov.in");

}

else if(g=="HEC"){

html+=card("BA English","3 Years","Writer","https://ncs.gov.in");
html+=card("Journalism","3 Years","Journalist","https://ncs.gov.in");
html+=card("LLB","5 Years","Lawyer","https://ncs.gov.in");
html+=card("Political Science","3 Years","Civil Services","https://ncs.gov.in");
html+=card("Psychology","3 Years","Psychologist","https://ncs.gov.in");
html+=card("Fine Arts","4 Years","Designer","https://ncs.gov.in");
html+=card("Animation","3 Years","Animator","https://ncs.gov.in");
html+=card("Public Administration","3 Years","Government Officer","https://ncs.gov.in");
html+=card("Event Management","3 Years","Event Manager","https://ncs.gov.in");
html+=card("Foreign Languages","3 Years","Translator","https://ncs.gov.in");

}

}

/* ================= EXAMS ================= */

if(type=="exam"){

title.innerText="📝 Competitive Exams";

html+=card("UPSC","IAS / IPS","NCERT + Polity","https://upsc.gov.in");
html+=card("SSC CHSL","12th Level","Reasoning + English","https://ssc.gov.in");
html+=card("IBPS PO","Banking","Aptitude + English","https://ibps.in");
html+=card("RRB NTPC","Railways","Maths + GK","https://indianrailways.gov.in");
html+=card("APPSC Group 2","Andhra Pradesh","History + Economy","https://psc.ap.gov.in");
html+=card("TSPSC Group 2","Telangana","Polity + GK","https://tspsc.gov.in");

}

/* ================= RESUME ================= */

if(type=="resume"){

title.innerText="📄 Resume Builder";

const name=document.getElementById("name").value;

html=`
<div class="resume">
<h2>${name}</h2>
<p>${q} (${g})</p>

<hr>

<h3>Skills</h3>
<p>Java • Python • HTML • Communication</p>

<h3>Career Objective</h3>
<p>Aspiring student passionate about innovation and technology.</p>

<button>Download Resume</button>

</div>
`;

}

body.innerHTML=html;

}

/* Scholarship Eligibility */

function eligibility(){

const income=Number(document.getElementById("income").value);

document.getElementById("eligibilityBox").style.display="block";

let result="";

if(income<=250000){

result+=`
<div class="job-card">
<h3>National Fellowship for ST</h3>
<p>Stipend: ₹28,000/month</p>
<a href="https://tribal.nic.in/ScholarshiP.aspx" target="_blank">Apply</a>
</div>`;

result+=`
<div class="job-card">
<h3>Top Class Education Scheme</h3>
<p>₹36,000/year</p>
<a href="https://dbttribal.gov.in" target="_blank">Apply</a>
</div>`;

}

if(income<=800000){

result+=`
<div class="job-card">
<h3>Reliance Foundation Scholarship</h3>
<p>Up to ₹2,00,000/year</p>
<a href="https://www.reliancefoundation.org" target="_blank">Apply</a>
</div>`;

}

document.getElementById("scholarList").innerHTML=result;

}