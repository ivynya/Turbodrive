import { Turbo$Course, Turbo$CourseData } from '../schemas';

interface Data {
  refreshToken: string,
  courses: Turbo$Course[],
  courseData: {
    [id: string]: Turbo$CourseData
  }
}

export const DefaultData: Data = {
  refreshToken: "",
  courses: [
    {
      id: "123",
      name: "Class 123",
      ownerId: "321",
      creationTime: "2020-01-01T23:00:00.000Z",
      updateTime: "2020-01-02T23:00:00.000Z",
      enrollmentCode: "E123",
      courseState: "ACTIVE",
      alternateLink: "https://classroom.google.com/c/123",
      teacherGroupEmail: "class_123_teachers@example.com",
      courseGroupEmail: "class_123_group@exmaple.com",
      guardiansEnabled: false,
      calendarId: "class_123_calendar@group.calendar.google.com",
      hasUnread: false,
      rank: 0
    },
    {
      id: "456",
      name: "Class 456",
      ownerId: "654",
      creationTime: "2020-01-01T23:00:00.000Z",
      updateTime: "2020-01-02T23:00:00.000Z",
      enrollmentCode: "E456",
      courseState: "ACTIVE",
      alternateLink: "https://classroom.google.com/c/456",
      teacherGroupEmail: "class_456_teachers@example.com",
      courseGroupEmail: "class_456_group@exmaple.com",
      guardiansEnabled: false,
      calendarId: "class_456_calendar@group.calendar.google.com",
      hasUnread: true,
      rank: 1
    }
  ],
  courseData: {
    "123": {
      announcements: [
				{
					courseId: "123",
					id: "1234",
					text: "Announcement\nText",
					state: "PUBLISHED",
					alternateLink: "https://classroom.google.com/c/123/p/1234",
					creationTime: "2020-01-05T23:00:00.000Z",
					updateTime: "2020-01-05T23:00:00.000Z",
					creatorUserId: "321",
					read: true
				}
      ],
      assignments: [
        {
					courseId: "123",
					id: "123321",
					title: "Title",
					description: "Description\nNewline",
					materials: [],
					state: "PUBLISHED",
					alternateLink: "https://classroom.google.com/c/123/a/123321/details",
					creationTime: "2020-01-03T23:00:00:000Z",
					updateTime: "2020-01-04T23:00:00:000Z",
					dueDate: {
						year: 2020,
						month: 1,
						day: 5
					},
					dueTime: {
						hours: 6,
						minutes: 59
					},
					maxPoints: 100,
					workType: "ASSIGNMENT",
					submissionModificationMode: "MODIFIABLE_UNTIL_TURNED_IN",
					creatorUserId: "321",
					read: true
				}
      ]
    },
    "456": {
      announcements: [
				{
					courseId: "456",
					id: "4567",
					text: "Announcement\nText",
					state: "PUBLISHED",
					alternateLink: "https://classroom.google.com/c/456/p/4567",
					creationTime: "2020-01-05T23:00:00.000Z",
					updateTime: "2020-01-05T23:00:00.000Z",
					creatorUserId: "654",
					read: false
				}
      ],
      assignments: [
        {
					courseId: "456",
					id: "456654",
					title: "Title",
					description: "Description\nNewline",
					materials: [],
					state: "PUBLISHED",
					alternateLink: "https://classroom.google.com/c/456/a/456654/details",
					creationTime: "2020-01-03T23:00:00:000Z",
					updateTime: "2020-01-04T23:00:00:000Z",
					dueDate: {
						year: 2020,
						month: 1,
						day: 5
					},
					dueTime: {
						hours: 6,
						minutes: 59
					},
					maxPoints: 100,
					workType: "ASSIGNMENT",
					submissionModificationMode: "MODIFIABLE_UNTIL_TURNED_IN",
					creatorUserId: "654",
					read: false
				}
      ]
    }
  }
}