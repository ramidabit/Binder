const firebase = require('firebase');
const admin = require('firebase-admin');

function addCourse(db, dept, num){
   db.collections('courses').doc(dept.concat(' ', num)).set({
       dept: dept,
       num: num,
       students: []
   }).catch((error) => {
       console.error('Error creating document', error);
   });
}
function addStudent(db, dept, num, student){
   db.runTransaction((transaction) => {
       courseRef = db.collections('courses').doc(dept.concat(' ', num));
       studentRef = db.collections('users').doc(student.email);
       transaction.get(courseRef).then((res) => {
           if (!res.exists) {
               throw "Document does not exist!";
           }
           let students = res.data().students.slice();
           students.push(student);
           transaction.set(courseRef, {dept: dept, num: num, students, students});
       });
       transaction.set(studentRef, {email: student.email, name: student.name, course: {dept, num}});
      
   });
}
function findMatch(db, student){
   db.runTransaction((transaction) => {

   })
}
function deleteStudents(db, dept, num){
   db.runTransaction((transaction) => {
       userRef = db.collections('users').doc(user.email);
      
   });
}
module.exports = {addCourse: addCourse, addStudent: addStudent};
