export const pages = {
  home: '/',
  exec: '/about-us/exec',
  history: '/about-us/history',
  academicSocieties: '/societies/academic',
  sportsSocieties: '/societies/sports',
  otherSocieties: '/societies/others',
  periodVend: '/resources/period-vend',
  collegeMap: '/documents/college-map.pdf',
} as const;

export const external = {
  // KCSU documents and forms
  constitution: 'https://docs.google.com/document/d/1yzBEGyGVGohqKL7Woxnf0zJ8EAfA31mBKjmVxNv5wg8',
  standingOrders: 'https://docs.google.com/document/d/1izkmCH05plGgLAjIcfJlkFFyhPhyTBwxBygc3YXoc8Y',
  privacyPolicy: 'https://docs.google.com/document/d/1TdlqKOIATj2MuTaNxr6W52P9B_6yNuvy/edit',
  hallBooking: 'https://docs.google.com/document/d/12-Jy5xKr6Pa4tNveaJyEHECNGHNNQv7NtNNDAGd9tv4/edit?tab=t.0#heading=h.ict5vuxw9vdv',
  supportInfoSheet: 'https://docs.google.com/document/d/1c6rFJkM2zboboTry1BjkvWEbXmZaCi6u/edit',
  feedbackForm: 'https://docs.google.com/forms/d/e/1FAIpQLScMROYSHkN8-zhdUpSlg7iiPbneCPHxYxKzy-Gt4Sk-WUA54w/viewform',
  eventsCalendar: 'https://calendar.google.com/calendar/u/0/embed?src=events@kcsu.org.uk&ctz=Europe/London',

  // KCSU services and socials
  formalBooking: 'https://store.kcsu.org.uk',
  libraryOfThings: 'https://library.kcsu.org.uk',
  kords: 'https://kords.kcsu.org.uk',
  facebook: 'https://www.facebook.com/KingsCollegeStudentUnion',
  instagram: 'https://www.instagram.com/KCSUCambridge/',

  // King's College
  college: 'https://www.kings.cam.ac.uk',
  intranet: 'https://www.kings.cam.ac.uk/intranet',
  studentSupport: 'https://www.kings.cam.ac.uk/student-support-and-wellbeing',
  maintenance: 'https://nicholas.kings.cam.ac.uk/intranet/maintenance-ticket-system',
  epos: 'https://epos.kings.cam.ac.uk',
  plms: 'https://plms.kings.cam.ac.uk',
  portersPhone: 'tel:+441223331100',
  itSupportEmail: 'mailto:it.support@kings.cam.ac.uk',
  kcgu: 'https://www.kcgu.org',

  // University
  counselling: 'https://www.studentsupport.cam.ac.uk/individual-counselling',
  cambridgeSuAdvice: 'https://www.cambridgesu.co.uk/advice/student-advice-service/',
  rms: 'https://app.casc.cam.ac.uk/rms_live/InstHome.aspx',
  camcors: 'https://apps.casc.cam.ac.uk/ors',
  lookup: 'https://www.lookup.cam.ac.uk',

  // Getting around
  busTimes: 'https://smartcambridge.org/transport/map/',
  trainTimes: 'https://www.realtimetrains.co.uk/search/simple/gb-nr:CBG',
} as const;
