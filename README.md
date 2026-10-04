# Bill Splitter

Bill Splitter is a simple web application that makes it easy to divide a bill among multiple people. Enter the total bill amount, specify the number of people, and the application calculates the amount each person needs to pay.

The application uses a Java backend to perform the bill calculations and a lightweight HTML, CSS, and JavaScript frontend for the user interface.

**It is important to note that this project exists in three versions, one of which uses java as a backend. More information on the same will be provided below**
- Version 1: Simple bill splitter with java backend. Visually appealing design.
- Version 2: Same visual appeal as v1, but without the requirement of java for simplicity and ease of use.
- Version 3: A fresh new and minimal feel without the complexity of a java backend. \
**The folders that represent the above said versions can be found in the structures section of this README file.**


## Features

- Calculate the total bill amount
- Split a bill equally among multiple people
- Add participant names
- Include a tip when calculating the final bill
- View a clear breakdown of the bill
- Print the bill summary
- Share the bill summary

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Java (For version 1 only!)

### Deployment
- GitHub
- Vercel

## Project Structure

```text
Bill-splitter /
├── README.md
├── version1_java
│   ├── Backend
│   │   └── ...
│   └── Frontend
│       └── ...
├── version2
│   └── ...
└── version3
    └── ...

"Version 1" is enclosed in the directory version1_java with different directories for Front and Backend(java).
"Version 2" is enclosed in the directory version2
"Version 3" is enclosed in the directory version3
```

## Deployment

The application is deployed using Vercel, with the frontend and backend deployed separately.

The frontend communicates with the deployed Java backend for **Version 1** through its API endpoints. \
As there is no requirement for two deployments in the other versions of this application, they are deployed as a sinular project, the links to all these deployments is provided in the **"Live Demo"** section below.

## Live Demo

[Bill Splitter Version 1](https://bill-splitter-main.vercel.app/)
[Bill Splitter Version 2](https://bill-splitter-v2-peach.vercel.app/)
[Bill Splitter Version 3](https://bill-splitter-v3-one.vercel.app/)

## Repository

[GitHub Repository](https://github.com/jayantsingh0702/Bill-splitter)

## Author

**Jayant Singh**

[GitHub Profile](https://github.com/jayantsingh0702)
