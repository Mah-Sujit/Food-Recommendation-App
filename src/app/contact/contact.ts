import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent implements AfterViewInit {

  /* =====================================================
       CONTACT FORM DATA
  ====================================================== */
  form = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    industry: "",
    employees: "",
    usage: "",
    message: ""
  };

  /* =====================================================
       SWEETALERT POPUP STATE
  ====================================================== */
  alertVisible: boolean = false;
  alertSuccess: boolean = false;
  alertMessage: string = "";

  showAlert(message: string, success: boolean) {
    this.alertMessage = message;
    this.alertSuccess = success;
    this.alertVisible = true;

    // Auto close if success
    if (success) {
      setTimeout(() => {
        this.alertVisible = false;
      }, 2000);
    }
  }

  closeAlert() {
    this.alertVisible = false;
  }

  /* =====================================================
       PARTICLES (Interactive Floating)
  ====================================================== */
  particles = Array(35).fill(0);

  ngAfterViewInit() {
    setTimeout(() => {
      const particleEls = document.querySelectorAll('.particle');

      particleEls.forEach((p: Element) => {
         const particle = p as HTMLElement;
        const size = Math.random() * 10 + 6;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = Math.random() * 15 + 10;

        particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${left}vw`;
  particle.style.top = `${top}vh`;
  particle.style.animationDuration = `${duration}s`;
       

        // Add mouse repel effect
        window.addEventListener('mousemove', (e: MouseEvent) => {
          const dx = particle.offsetLeft - e.clientX;
          const dy = particle.offsetTop - e.clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            particle.style.transform = `translate(${dx / 3}px, ${dy / 3}px)`;
          } else {
            particle.style.transform = "translate(0, 0)";
          }
        });
      });
    });
  }

  /* =====================================================
       OPTIONAL 3D IMAGE TILT (if used)
  ====================================================== */
  @ViewChild('momoImg') momoImg!: ElementRef;

  tiltImage(event: MouseEvent) {
    if (!this.momoImg) return;

    const img = this.momoImg.nativeElement;
    const rect = img.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * -12;

    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }

  resetTilt() {
    if (!this.momoImg) return;
    this.momoImg.nativeElement.style.transform = "rotateX(0) rotateY(0) scale(1)";
  }

  /* =====================================================
       FORM SUBMISSION LOGIC
  ====================================================== */
  submitForm() {
    const { firstName, email, message } = this.form;

    if (!firstName || !email || !message) {
      this.showAlert("Please fill all required fields.", false);
      return;
    }

    if (!email.includes("@")) {
      this.showAlert("Invalid email address format.", false);
      return;
    }

    // SUCCESS
    this.showAlert("Message sent successfully!", true);

    // Reset form
    this.form = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      country: "",
      industry: "",
      employees: "",
      usage: "",
      message: ""
    };
  }
}
