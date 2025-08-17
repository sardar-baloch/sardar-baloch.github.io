import { Component, AfterViewInit, HostListener } from '@angular/core';
import PureCounter from '@srexi/purecounterjs';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

declare var AOS: any;
declare var Typed: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  isHeaderVisible = false;
  showScrollTop = false;
  loading = false;
  successMessage = '';
  errorMessage = '';
  title = 'Portfolio - Sardar Baloch';

  ngAfterViewInit(): void {
    new PureCounter();
    const progressBars = document.querySelectorAll<HTMLDivElement>('.progress-bar');
    progressBars.forEach(bar => {
      const target = bar.getAttribute('aria-valuenow');
      if (target) {
        bar.style.width = '0'; // start from 0
        const value = parseInt(target, 10);
        let width = 0;
        const interval = setInterval(() => {
          if (width >= value) {
            clearInterval(interval);
          } else {
            width++;
            bar.style.width = width + '%';
          }
        }, 10); // Adjust speed if needed
      }
    });
    // Re-initialize AOS animations
    if (AOS) {
      AOS.init();
    }

    // Start Typed.js effect if used
    if (Typed) {
      new Typed('.typed', {
        strings: [
          'Software Engineer',
          'Full Stack Developer',
          'Frontend Developer',
          'Backend Developer'
        ],
        typeSpeed: 100,
        backSpeed: 50,
        loop: true
      });
    }
  }

  toggleHeader() {
    this.isHeaderVisible = !this.isHeaderVisible;
  }

  closeHeader() {
    this.isHeaderVisible = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop = window.scrollY > 200; // show after 200px scroll
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sendEmail(form: any) {
    if (!form.valid) {
      this.errorMessage = "Please fill all required fields correctly.";
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    emailjs.send(
      'service_vasl9y7',
      'template_1pde105',
      form.value,
      'cgB2pyRARjkmw7kRl'
    )
    .then((result: EmailJSResponseStatus) => {
      // After successful send, trigger auto-reply
      return this.sendAutoReply(form.value);
    })
    .then(() => {
      this.successMessage = "Your message has been sent. Thank you!";
      this.autoClearMessage('success');
      form.resetForm();
    })
    .catch((error) => {
      this.errorMessage = "Oops! Something went wrong. Please try again.";
      this.autoClearMessage('error');
      console.error('Email error:', error);
    })
    .finally(() => {
      this.loading = false;
    });
  }

  private sendAutoReply(formData: any): Promise<EmailJSResponseStatus> {
    // Ensure we have required fields with fallbacks
    const autoReplyData = {
      to_name: formData.name || 'Customer',
      to_email: formData.email, // This is now guaranteed to exist
      subject: formData.subject || 'Your inquiry',
      company_name: 'Your Company Name',
      reply_timeframe: '1-2 business days'
    };

    return emailjs.send(
      'service_vasl9y7', // Use your auto-reply service ID if different
      'template_kashj7s', // Your auto-reply template ID
      autoReplyData,
      'cgB2pyRARjkmw7kRl'
    );
  }

  autoClearMessage(type: 'success' | 'error') {
    setTimeout(() => {
      if (type === 'success') this.successMessage = '';
      if (type === 'error') this.errorMessage = '';
    }, 5000); // Message disappears after 5 seconds
  }
}
