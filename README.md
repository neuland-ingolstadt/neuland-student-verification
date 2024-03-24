# neuland-student-verification

neuland-student-verfication is an email-based tool to verify the student status of club members. It authenticates users via email, verifies their enrolment by sending another email to their student address and stores the result in an easyVerein or Webling backend. Other member management systems are not supported but can be implemented fairly easily.

## Setup

No database is necessary, all data is carried via JWT included in the verification links. Deploy by creating an `.env` file (see `.env.example` for reference) and building the Docker container.
