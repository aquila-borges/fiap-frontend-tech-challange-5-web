// Environment: DEVELOPMENT
// Usado quando rodar: npm start ou ng serve
export const environment = {
  production: false,
  environment: 'development',
  apiUrl: 'http://localhost:3000/api', // API local
  firebase: {
    apiKey: "AIzaSyChAfo4mkD0CqITyOs1riIyD5tfeVVUMJk",
    authDomain: "fiap-tech-challenge-5-828e1.firebaseapp.com",
    projectId: "fiap-tech-challenge-5-828e1",
    storageBucket: "fiap-tech-challenge-5-828e1.appspot.com",
    messagingSenderId: "277329559001",
    appId: "1:277329559001:web:16fa71f4c91534e8796dc8"
  },
  enableDebug: true,
  logLevel: 'debug'
};
