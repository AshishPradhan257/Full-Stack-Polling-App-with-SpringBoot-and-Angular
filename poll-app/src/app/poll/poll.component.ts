import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { Poll } from '../poll.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll',
  standalone: true, // Assuming a standard modern Angular setup
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css',
})
export class PollComponent implements OnInit {
  // We initialize without an ID to tell the backend this is a NEW poll
  newPoll: Poll = {
    question: '',
    options: [
      { voteOption: '', voteCount: 0 },
      { voteOption: '', voteCount: 0 }
    ],
    id: 0
  };

  polls: Poll[] = [];

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls() {
    this.pollService.getPolls().subscribe({
      next: (data) => {
        this.polls = data;
        console.log("Polls loaded successfully:", data);
      },
      error: (error) => {
        console.error("Error fetching polls:", error);
      }
    });
  }

  createPoll() {
    // We send the current state of newPoll to the service
    this.pollService.createPoll(this.newPoll).subscribe({
      next: (createdPoll) => {
        // 1. Update the local list so the UI reflects the change immediately
        this.polls.push(createdPoll);
        
        // 2. Reset the form to its initial state so the user can create another poll
        this.resetForm();
        
        console.log("Poll created successfully:", createdPoll);
      },
      error: (error) => {
        // This will now be caught if the backend throws an error
        console.error("Error creating poll:", error);
        alert("Failed to create poll. Please check the backend logs.");
      }
    });
  }

  // Helper method to clear the form
  private resetForm() {
    this.newPoll = {
      question: '',
      options: [
        { voteOption: '', voteCount: 0 },
        { voteOption: '', voteCount: 0 }
      ],
      id: 0
    }; 
  }

  vote(pollId: number, optionIndex: number) {
    this.pollService.vote(pollId, optionIndex).subscribe({
      next: (updatedPoll) => {
        const poll = this.polls.find(p => p.id === pollId);
        if (poll) {
          poll.options[optionIndex].voteCount += 1;
        }
      },
      error: (error) => {
        console.error("Error voting:", error);
      }
    });
  }
}