const NUMBER_OF_HEARTS = 50;
const FPS = 40;
const SPF = 1 / FPS;
const FRAMES_PER_PHYSICS_UPDATE = 10;
const PHYSICS_FPS = FPS / FRAMES_PER_PHYSICS_UPDATE;
const PHYSICS_SPF = 1 / PHYSICS_FPS;
const FRAMES_PER_INTERACTION_UPDATE = 4;
const INTERACTION_FPS = FPS / FRAMES_PER_INTERACTION_UPDATE;
const INTERACTION_SPF = 1 / INTERACTION_FPS;

class FloatingHeart {
   VELOCITY_FRICTION = 0.7 ** PHYSICS_SPF;
   ROTATION_FRICTION = 0.9 ** PHYSICS_FPS;
   EDGE_REPULSION_MINIMUM_DIST = 80;
   EDGE_REPULSION_STRENGTH = 5;
   MAX_VELOCTY_SQUARED = 3000;
   MAX_RMOM = 100;
   NUMBER_OF_HEARTS_SAMPLED_AVOIDED = 10;
   HEART_REPULSION_MINIMUM_DIST_SQUARED = 10000;
   HEART_REPULSION_STRENGTH = 4000;
   MOUSE_AFFECT_MINIMUM_DIST_SQUARED = 20000;
   MOUSE_AFFECT_STRENGTH = 45;

   constructor(parent, x, y, rotation) {
      this.parent = parent;
      this.heart_img = document.createElement("img");
      this.heart_img.src = "images/heart.webp";
      this.heart_img.classList.add("floating-heart");
      $(".hearts").append(this.heart_img);
      this.setx(
         randint(
            this.EDGE_REPULSION_MINIMUM_DIST / 2,
            window.innerWidth - this.EDGE_REPULSION_MINIMUM_DIST / 2
         )
      );
      this.sety(
         randint(
            this.EDGE_REPULSION_MINIMUM_DIST / 2,
            window.innerHeight - this.EDGE_REPULSION_MINIMUM_DIST / 2
         )
      );
      this.setxmom(randint(-200, 200));
      this.setymom(randint(-200, 200));
      this.setrotation(randint(0, 360));
      this.rmom = randint(-1000, 1000);
   }

   setx(value) {
      this.x = value;
      this.heart_img.style.left = `${this.x}px`;
      if (this.y !== undefined) this.pos = [this.x, this.y];
   }

   sety(value) {
      this.y = value;
      this.heart_img.style.top = `${this.y}px`;
      if (this.x !== undefined) this.pos = [this.x, this.y];
   }

   setrotation(value) {
      while (value > 180) {
         value -= 360;
      }
      while (value < -180) {
         value += 360;
      }
      this.rotation = value;
      this.heart_img.style.transform = `translate(-50%, -50%) rotate(${this.rotation}deg)`;
   }

   addx(value) {
      this.setx(this.x + value);
   }

   addy(value) {
      this.sety(this.y + value);
   }

   addrotation(value) {
      this.setrotation(this.rotation + value);
   }

   setxmom(value) {
      this.xmom = value;
      if (this.ymom !== undefined)
         this.velocity_squared = this.xmom ** 2 + this.ymom ** 2;
   }

   setymom(value) {
      this.ymom = value;
      if (this.xmom !== undefined)
         this.velocity_squared = this.xmom ** 2 + this.ymom ** 2;
   }

   setrmom(value) {
      this.rmom = value;
   }

   addxmom(value) {
      this.setxmom(this.xmom + value);
   }

   addymom(value) {
      this.setymom(this.ymom + value);
   }

   addrmom(value) {
      this.setrmom(this.rmom + value);
   }

   apply_edge_repulsion() {
      if (this.x < this.EDGE_REPULSION_MINIMUM_DIST) {
         this.addxmom(
            PHYSICS_SPF *
               this.EDGE_REPULSION_STRENGTH *
               (this.EDGE_REPULSION_MINIMUM_DIST - this.x)
         );
      }
      if (this.y < this.EDGE_REPULSION_MINIMUM_DIST) {
         this.addymom(
            PHYSICS_SPF *
               this.EDGE_REPULSION_STRENGTH *
               (this.EDGE_REPULSION_MINIMUM_DIST - this.y)
         );
      }
      if (window.innerWidth - this.x < this.EDGE_REPULSION_MINIMUM_DIST) {
         this.addxmom(
            PHYSICS_SPF *
               this.EDGE_REPULSION_STRENGTH *
               (window.innerWidth - this.x - this.EDGE_REPULSION_MINIMUM_DIST)
         );
      }
      if (window.innerHeight - this.y < this.EDGE_REPULSION_MINIMUM_DIST) {
         this.addymom(
            PHYSICS_SPF *
               this.EDGE_REPULSION_STRENGTH *
               (window.innerHeight - this.y - this.EDGE_REPULSION_MINIMUM_DIST)
         );
      }
   }

   avoid_other_hearts() {
      let idx = randint(0, this.parent.hearts.length);
      let other;
      for (let i = 0; i < this.NUMBER_OF_HEARTS_SAMPLED_AVOIDED; i++) {
         other = this.parent.hearts[(idx + i) % this.parent.hearts.length];
         if (other == this) continue;
         if (
            (this.x - other.x) ** 2 + (this.y - other.y) ** 2 <
            this.HEART_REPULSION_MINIMUM_DIST_SQUARED
         ) {
            let deltax = this.x - other.x;
            let deltay = this.y - other.y;
            let delta_squared = deltax ** 2 + deltay ** 2;
            this.addxmom(
               (SPF * this.HEART_REPULSION_STRENGTH * deltax) / delta_squared
            );
            this.addymom(
               (SPF * this.HEART_REPULSION_STRENGTH * deltay) / delta_squared
            );
            other.addxmom(
               -(SPF * this.HEART_REPULSION_STRENGTH * deltax) / delta_squared
            );
            other.addymom(
               -(SPF * this.HEART_REPULSION_STRENGTH * deltay) / delta_squared
            );
         }
      }
   }

   do_mouse_acceleration() {
      let dtoprevsq = vec_size_squared(
         vec_sub(this.pos, this.parent.mouse_prev_pos)
      );
      let dtomidsq = vec_size_squared(
         vec_sub(this.pos, this.parent.mouse_midpoint)
      );
      let dtocursq = vec_size_squared(
         vec_sub(this.pos, this.parent.mouse_cur_pos)
      );
      if (
         Math.min(dtoprevsq, dtomidsq, dtocursq) >
         this.MOUSE_AFFECT_MINIMUM_DIST_SQUARED
      ) {
         return;
      }

      let parallel = vec_div(
         vec_mul(this.parent.mouse_movement, 10 * this.MOUSE_AFFECT_STRENGTH),
         vec_size(vec_sub(this.parent.mouse_midpoint, this.pos)) + 10
      );
      if (parallel.includes(NaN)) return;
      this.addxmom(parallel[0] * INTERACTION_SPF);
      this.addymom(parallel[1] * INTERACTION_SPF);
      this.addrmom(
         isPointLeftOrRight(
            this.x,
            this.y,
            this.parent.mouse_prev_pos[0],
            this.parent.mouse_prev_pos[1],
            this.parent.mouse_cur_pos[0],
            this.parent.mouse_cur_pos[1]
         ) *
            vec_size(parallel) *
            0.2
      );
   }

   apply_friction() {
      if (this.velocity_squared > this.MAX_VELOCTY_SQUARED) {
         this.setxmom(this.xmom * this.VELOCITY_FRICTION);
         this.setymom(this.ymom * this.VELOCITY_FRICTION);
      }
      if (Math.abs(this.rmom) > this.MAX_RMOM) {
         this.setrmom(this.rmom * this.ROTATION_FRICTION);
      }
   }

   step() {
      this.addx(this.xmom * SPF);
      this.addy(this.ymom * SPF);
      this.addrotation(this.rmom * SPF);
   }
   physics_step() {
      this.apply_edge_repulsion();
      this.avoid_other_hearts();
      this.apply_friction();
   }

   interaction_step() {
      this.do_mouse_acceleration();
   }
}

class PhysicsEngine {
   constructor() {
      this.mouse_prev_pos = [0, 0];
      this.mouse_cur_pos = [0, 0];
      this.hearts = [];
      for (let i = 0; i < NUMBER_OF_HEARTS; i++) {
         this.hearts.push(
            new FloatingHeart(
               this,
               randint(0, window.innerWidth),
               randint(0, window.innerHeight),
               randint(0, 360)
            )
         );
      }
   }

   update_mouse_pos() {
      this.mouse_prev_pos = this.mouse_cur_pos;
      this.mouse_cur_pos = [mousex, mousey];
      this.mouse_midpoint = vec_div(
         vec_add(this.mouse_cur_pos, this.mouse_prev_pos),
         2
      );

      this.mouse_movement = vec_sub(this.mouse_cur_pos, this.mouse_prev_pos);
   }

   step() {
      this.hearts.forEach((h) => {
         h.step();
      });
   }

   physics_step() {
      this.hearts.forEach((h) => {
         h.physics_step();
      });
   }

   interaction_step() {
      this.update_mouse_pos();

      this.hearts.forEach((h) => {
         h.interaction_step();
      });
   }

   async run() {
      let frame_number = 0;
      while (true) {
         if (frame_number % FRAMES_PER_PHYSICS_UPDATE == 0) {
            this.physics_step();
         }
         if (frame_number % FRAMES_PER_INTERACTION_UPDATE == 0) {
            this.interaction_step();
         }
         this.step(frame_number);
         frame_number += 1;
         await sleep(SPF * 1000);
      }
   }
}

$(function () {
   const physics_engine = new PhysicsEngine();
   physics_engine.run();
});
