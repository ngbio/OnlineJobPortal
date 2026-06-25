# Online Job Portal

Online Job Portal is a full-stack recruitment platform built with Django REST Framework and React Native. The system supports two main user roles: candidates can search jobs and submit applications, while employers can manage job posts, review applications, comment on applications, and view recruitment statistics.

## Features

### Candidate

- Register and log in with OAuth2 bearer-token authentication.
- Browse job posts by category.
- Search jobs by job title, company, and address.
- Sort jobs by newest posts or highest salary.
- View job details, including company, salary, address, requirements, description, and benefits.
- Apply for jobs with personal information and CV upload.
- View application history.
- Read comments related to submitted applications.

### Employer

- Register as an employer account.
- Create, update, and delete job posts.
- View only their own posted jobs after logging in.
- Review candidate applications for each job post.
- Comment on candidate applications.
- View application statistics for posted jobs.

### Admin

- Manage users, categories, job posts, applications, and comments through Django Admin.
- View custom admin statistics by category and job application count.

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- MySQL
- Django OAuth Toolkit
- Cloudinary
- drf-yasg Swagger/ReDoc
- django-cors-headers
- CKEditor

### Mobile

- React Native
- Expo
- JavaScript
- Axios
- React Navigation
- React Native Paper
- AsyncStorage
- Expo Image Picker

## Project Structure

```text
OnlineJobPortal/
|-- jobportal/              # Django backend
|   |-- jobapps/            # Main Django app
|   |   |-- models.py       # User, Category, JobPost, Applications, Comment
|   |   |-- serializers.py  # DRF serializers
|   |   |-- views.py        # API viewsets and permissions
|   |   |-- urls.py         # API routes
|   |   `-- admin.py        # Custom Django Admin
|   |-- jobportal/          # Django project settings
|   |-- manage.py
|   `-- requirements.txt
|
|-- jobmobile/              # React Native mobile app
|   |-- components/         # Shared UI components
|   |-- screens/            # App screens
|   |-- utils/              # API config, contexts, reducers
|   |-- App.js
|   `-- package.json
|
`-- README.md
```

## Database Models

- `User`: custom Django user with `candidate` and `employer` roles.
- `Category`: job category.
- `JobPost`: job posting created by employers.
- `Applications`: candidate application with uploaded CV.
- `Comment`: employer/candidate discussion on an application.

## API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/categories/` | List job categories |
| `GET` | `/job_post/` | List job posts with filtering, sorting, and pagination |
| `POST` | `/job_post/add_job/` | Create a job post as an approved employer |
| `PATCH` | `/job_post/{id}/update_job/` | Update an employer's job post |
| `DELETE` | `/job_post/{id}/delete_job/` | Delete an employer's job post |
| `POST` | `/job_post/{id}/apply/` | Apply for a job as a candidate |
| `GET` | `/job_post/{id}/applications/` | View applications for an employer's job post |
| `GET` | `/applications/` | View application history |
| `GET` / `POST` | `/applications/{id}/comments/` | View or create application comments |
| `POST` | `/users/` | Register a new user |
| `GET` / `PATCH` | `/users/current-user/` | Get or update current user profile |
| `GET` | `/stats/employer-stats/` | View employer job application statistics |
| `POST` | `/o/token/` | OAuth2 login token endpoint |

API documentation is available at:

- Swagger UI: `http://127.0.0.1:8000/swagger/`
- ReDoc: `http://127.0.0.1:8000/redoc/`

## Backend Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd OnlineJobPortal/jobportal
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
venv\Scripts\activate
```

On macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure MySQL

Create a MySQL database:

```sql
CREATE DATABASE jobdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update database credentials in `jobportal/settings.py` if your local MySQL username or password is different.

### 5. Configure Cloudinary and OAuth2

Update the Cloudinary and OAuth2 settings in `jobportal/settings.py` with your own credentials before running the project in another environment.

Recommended values to review:

- `cloud_name`
- `api_key`
- `api_secret`
- `CLIENT_ID`
- `CLIENT_SECRET`

### 6. Run migrations

```bash
python manage.py migrate
```

The project includes a seed migration that creates sample categories, employers, candidates, job posts, and applications.

### 7. Create a superuser

```bash
python manage.py createsuperuser
```

### 8. Start the backend server

```bash
python manage.py runserver
```

Backend server:

```text
http://127.0.0.1:8000/
```

Django Admin:

```text
http://127.0.0.1:8000/admin/
```

## Mobile App Setup

### 1. Go to the mobile project

```bash
cd ../jobmobile
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API base URL

Open `jobmobile/utils/Apis.js` and update `BASE_URL` to match your backend server IP address.

Example:

```javascript
const BASE_URL = 'http://127.0.0.1:8000/';
```

For testing on a physical mobile device, use your computer's local network IP instead of `127.0.0.1`.

### 4. Start the Expo app

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

## Sample Accounts

The seed migration creates sample users:

| Role | Username | Password |
| --- | --- | --- |
| Employer | `employer1`, `employer2`, `employer3`, `employer4` | `123` |
| Candidate | `candidate1`, `candidate2`, `candidate3`, `candidate4`, `candidate5` | `123` |

## Authentication

The backend uses OAuth2 password grant flow from Django OAuth Toolkit.

Mobile login sends credentials to:

```text
POST /o/token/
```

Authenticated requests use:

```text
Authorization: Bearer <access_token>
```

## Notes

- Employer accounts are created as inactive by default and need approval before posting jobs.
- Candidate accounts are active immediately after registration.
- CV and avatar files are uploaded through multipart form data and stored with Cloudinary.
- Job posts are paginated with 20 items per page.
- Comments are paginated with 2 items per page.

## Author

Nguyen Thanh Thuan
