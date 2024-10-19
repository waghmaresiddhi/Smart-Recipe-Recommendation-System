import { Component } from '@angular/core';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css'],
})
export class HelpCenterComponent {
  isEditing: boolean = false; // This controls the visibility of the pop-up
  activeSection: string = ''; // Tracks the active section ('gettingStarted', 'accountManagement', etc.)
  popupTitle: string = '';    // Tracks the title of the pop-up

  // Function to open the pop-up based on which button is clicked
  openPopup(section: string) {
    this.activeSection = section;
    this.isEditing = true; // Show the pop-up

    // Set the title dynamically based on the section
    switch (section) {
      case 'gettingStarted':
        this.popupTitle = 'Getting Started Guide';
        break;
      case 'accountManagement':
        this.popupTitle = 'Account Management';
        break;
      case 'reporting':
        this.popupTitle = 'Reporting';
        break;
      case 'contact':
        this.popupTitle = 'Contact Us';
        break;
      default:
        this.popupTitle = '';
    }
  }

  // Function to close the pop-up
  closePopup() {
    this.isEditing = false;  // Hide the pop-up
    this.activeSection = ''; // Reset the section
  }
}
