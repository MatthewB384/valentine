class Question {
   constructor(text, correct_answer, wrong_answer, small_text = false) {
      this.text = text;
      this.correct_answer = correct_answer;
      this.wrong_answer = wrong_answer;
      this.small_text = small_text;
   }

   generate() {
      let right_answer = `<button class="answer-button yes-button" onclick="next_question()">${this.correct_answer}</button>`;
      let wrong_answer = `<button class="answer-button no-button" onclick="wrong_answer()">${this.wrong_answer}</button>`;
      let order =
         randint(0, 2) == 1
            ? `${right_answer} ${wrong_answer}`
            : `${wrong_answer} ${right_answer}`;
      $(".quiz-content").html(`
            <div class="question ${
               this.small_text ? " question-small-text" : ""
            }">${this.text}</div>
            <div class="answers">
               ${order}
            </div>`);
   }
}

class PictureQuestion {
   constructor(text, correct_picture, wrong_picture) {
      this.text = text;
      this.correct_picture = correct_picture;
      this.wrong_picture = wrong_picture;
   }

   generate() {
      let right_answer = `<button class="answer-button img-answer-button yes-button" onclick="next_question()"><img src="${this.correct_picture}" class="answer-img"></button>`;
      let wrong_answer = `<button class="answer-button img-answer-button no-button" onclick="wrong_answer()"><img src="${this.wrong_picture}" class="answer-img"></button>`;
      let order =
         randint(0, 2) == 1
            ? `${right_answer} ${wrong_answer}`
            : `${wrong_answer} ${right_answer}`;
      $(".quiz-content").html(`
            <div class="question">${this.text}</div>
            <div class="answers">${order}
            </div>`);
   }
}

class CaptchaQuestion {
   constructor(text, image, validpattern) {
      this.text = text;
      this.image = image;
      this.validpattern = validpattern;
   }

   get_pattern() {
      let pattern = new Array(16).fill(false);
      $(".captcha-square").each((i, e) => {
         pattern[i] = e.classList.contains("selected");
      });
      return pattern;
   }

   validate() {
      console.log(this.get_pattern(), this.validpattern);

      if (arraysEqual(this.get_pattern(), this.validpattern)) {
         next_question();
      } else {
         $(".captcha-block").addClass("shake");
         setTimeout(() => {
            $(".captcha-block").removeClass("shake");
         }, 500);
      }
   }
   generate() {
      $(".quiz-content").html(`
            <div class="question question-small-text">CAPTCHA: ${this.text}</div>
            <div class="captcha-block">
               <div class="captcha">
                  <div class="captcha-row">
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: 0rem; top: 0rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -3.1rem; top: 0rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -6.2rem; top: 0rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -9.3rem; top: 0rem;"></button>
                  </div>
                  <div class="captcha-row">
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: 0rem; top: -3.1rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -3.1rem; top: -3.1rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -6.2rem; top: -3.1rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -9.3rem; top: -3.1rem;"></button>
                  </div>
                  <div class="captcha-row">
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: 0rem; top: -6.2rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -3.1rem; top: -6.2rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -6.2rem; top: -6.2rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -9.3rem; top: -6.2rem;"></button>
                  </div>
                  <div class="captcha-row">
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: 0rem; top: -9.3rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -3.1rem; top: -9.3rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -6.2rem; top: -9.3rem;"></button>
                     <button class="captcha-square"><img class="captcha-image" src="${this.image}" style="left: -9.3rem; top: -9.3rem;"></button>
                  </div>
               </div>
               <button class="answer-button submit-captcha-button">Submit</button>  
            </div>`);
      $(".captcha-square").click(function () {
         $(this).toggleClass("selected");
         $(this).blur();
      });
      $(".submit-captcha-button").click(function () {
         questions[uptoquestion].validate();
         $(this).blur();
      });
   }
}

class Declaration {
   constructor(text, exclamation) {
      this.text = text;
      this.exclamation = exclamation;
   }
}
const questions = [
   new Question("Who's taking this quiz?", "Alicia", "Someone else"),
   new Question("Do you like me?", "Yes", "No"),
   new Question("Do you liiiiiiike me?", "Yes", "No"),
   new Question("Do you LIKE like me?", "Yes", "No"),
   new PictureQuestion(
      "Choose a date",
      "images/matt 1.jpg",
      "images/soojin.webp"
   ),
   new PictureQuestion(
      "Choose a date",
      "images/matt 2.jpg",
      "images/agnew.webp"
   ),
   new PictureQuestion("Choose a date", "images/matt 3.jpg", "images/rm.webp"),
   new PictureQuestion(
      "Choose a date",
      "images/matt 4.jpg",
      "images/daredevil.png"
   ),
   new PictureQuestion(
      "Choose a date",
      "images/matt 5.jpg",
      "images/connor.jpg"
   ),
   new Question(
      "Do you want to sit next to me at lunch?",
      "Yes",
      "No",
      (small_text = true)
   ),
   new Question(
      "Do you want to do cute RA jobs together tonight?",
      "Yes",
      "No",
      (small_text = true)
   ),
   new Question("Will you be my valentine?", "Yes", "No"),
   new Question("Are you sure?", "Yes", "No"),
   new CaptchaQuestion("Select all squares with cuties?", "images/us.JPG", [
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      true,
   ]),
   new CaptchaQuestion(
      "Select all squares with cuties?",
      "images/us3 crop2.jpg",
      [
         false,
         false,
         true,
         false,
         false,
         true,
         true,
         false,
         false,
         true,
         true,
         false,
         false,
         false,
         true,
         false,
      ]
   ),
];

function close_element(element) {
   element.removeClass("bouncing-in");
   element.addClass("bouncing-out");
   setTimeout(() => {
      element.hide();
   }, 400);
}

function open_element(element) {
   element.show();
   element.removeClass("bouncing-out");
   element.addClass("bouncing-in");
}

function close_quiz() {
   close_element($(".radial-gradient-border"));
   close_element($(".yippee-text-wrapper"));
   setTimeout(() => {
      open_element($(".welcome-text"));
   }, 400);
}

function open_quiz() {
   close_element($(".welcome-text"));
   close_element($(".yippee-text-wrapper"));
   setTimeout(() => {
      open_element($(".radial-gradient-border"));
   }, 400);
}

let uptoquestion = 0;
let question = questions[uptoquestion];

function next_question() {
   uptoquestion++;
   $(".progress-bar-inner").width(
      `${(uptoquestion / questions.length) * 100}%`
   );
   if (uptoquestion == questions.length) {
      setTimeout(() => end_quiz(), 400);
      return;
   }
   questions[uptoquestion].generate();
}

function wrong_answer() {
   console.log("called wrong answer");

   close_element($(".radial-gradient-border"));
   close_element($(".yippee-text-wrapper"));
   setTimeout(() => {
      $(".floating-heart").attr("src", "images/explosion.gif");
   }, 1000);
   setTimeout(() => {
      window.location.href = "https://www.youtube.com/watch?v=3HeCPlBxhg8";
   }, 2500);
}

function end_quiz() {
   close_element($(".welcome-text"));
   close_element($(".radial-gradient-border"));
   setTimeout(() => {
      open_element($(".yippee-text-wrapper"));
   }, 400);
}

$(function () {
   $(".radial-gradient-border").hide();
   $(".yippee-text-wrapper").hide();
   questions[uptoquestion].generate();
});
