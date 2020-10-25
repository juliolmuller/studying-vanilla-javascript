<h1 align="center">
  :books: Simple CRUD with Vanilla JavaScript
</h1>

<p align="center">
  <a href="#trophy-lessons-learned">Lessons Learned</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#rocket-technologies--resources">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#hammer-setting-up-the-environment">Environment Setup</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#zap-features-implementations">Features</a>
</p>

<p align="center">
  <img src="https://img.shields.io/static/v1?labelColor=000000&color=343a40&label=created%20at&message=Jan%202019" alt="Creation Date" />

  <img src="https://img.shields.io/github/last-commit/juliolmuller/studying-javascript-crud?label=updated%20at&labelColor=000000&color=343a40" alt="Update Date" />

  <img src="https://img.shields.io/github/v/tag/juliolmuller/studying-javascript-crud?label=latest%20version&labelColor=000000&color=343a40" alt="Latest Version" />

  <img src="https://img.shields.io/static/v1?labelColor=000000&color=343a40&label=PRs&message=welcome" alt="Pull Requests Welcome" />

  <img src="https://img.shields.io/github/license/juliolmuller/studying-javascript-crud?labelColor=000000&color=343a40" alt="Project License" />
</p>

![Application snapshot](./src/img/app-overview.jpg)

Frontend web CRUD application developed to refresh knowledge of DOM manipulation using vanilla JavaScript (no frameworks). This project was proposed and developed in [Hcode's Udemy course](https://www.udemy.com/course/javascript-curso-completo/), an awesome one - :smiley: highly recommended!

[Check out the application running!](https://juliolmuller.github.io/studying-javascript-crud/)

## :trophy: Lessons Learned

- ES6+ class notation;
- `localStorage`/`sessionStorage` API;
- `FileReader` to convert binary files into a Base64 encoded string;
- HTML `data-*` custom attributes API;
- How to create an app based on [Admin LTE 3](https://adminlte.io/themes/v3/);
- Overall tips on DOM manipulation;
- Bundling the application with [Parcel.js](https://parceljs.org/)

## :rocket: Technologies & Resources

**Development:**
- Visual Studio Code
- Parcel.js (for application bundling)

## :hammer: Setting up the Environment

Make sure to have **Node.js 10+** installed in your machine and its **npm** available in the command line, then use the following routines:

```bash
$ npm install   # Download dependencies
$ npm start     # Run development server
$ npm run build # Build files for production
```

## :zap: Features Implementations

- [x] Restore saved users from browser's local storage;
- [x] Create new users;
- [x] Edit existing users;
- [x] Delete existing users;
- [x] Save changes to browser's local storage;
- [x] Upgrade UI components to AdminLTE 3;
