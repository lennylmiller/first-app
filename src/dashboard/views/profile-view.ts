import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared-styles.js';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

@customElement('profile-view')
export class ProfileView extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        min-height: 0;
        overflow: auto;
      }

      .profile-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      @media (max-width: 768px) {
        .profile-container {
          padding: 1rem;
        }
      }

      @media (max-width: 480px) {
        .profile-container {
          padding: 0.75rem;
        }
      }

      .profile-header {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 2rem;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .avatar-container {
        position: relative;
        display: inline-block;
        margin-bottom: 1rem;
      }

      .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid var(--color-primary);
      }

      .avatar-edit {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 36px;
        height: 36px;
        background-color: var(--color-primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 3px solid var(--color-background);
      }

      .profile-info {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--color-text-primary);
      }

      .form-input {
        width: 100%;
        padding: 0.75rem;
        font-size: 1rem;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
    `
  ];

  @state()
  private user: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2196F3&color=fff',
    bio: 'Software developer passionate about web technologies.'
  };

  render() {
    return html`
      <div class="profile-container">
        <h1>Profile</h1>

        <div class="profile-header">
          <div class="avatar-container">
            <img class="avatar" src="${this.user.avatar}" alt="${this.user.name}">
            <div class="avatar-edit" @click="${this.editAvatar}">📷</div>
          </div>
          <h2>${this.user.name}</h2>
          <p>${this.user.email}</p>
        </div>

        <div class="profile-info">
          <form @submit="${this.handleSubmit}">
            <div class="form-group">
              <label class="form-label" for="name">Name</label>
              <input
                type="text"
                id="name"
                class="form-input"
                .value="${this.user.name}"
                @input="${(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  this.user = {...this.user, name: target.value};
                }}">
            </div>

            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                type="email"
                id="email"
                class="form-input"
                .value="${this.user.email}"
                @input="${(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  this.user = {...this.user, email: target.value};
                }}">
            </div>

            <div class="form-group">
              <label class="form-label" for="bio">Bio</label>
              <textarea
                id="bio"
                class="form-input"
                rows="4"
                .value="${this.user.bio}"
                @input="${(e: Event) => {
                  const target = e.target as HTMLTextAreaElement;
                  this.user = {...this.user, bio: target.value};
                }}"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="ghost" @click="${this.handleCancel}">Cancel</button>
              <button type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  private editAvatar(): void {
    console.log('Edit avatar');
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();
    console.log('Save profile:', this.user);
  }

  private handleCancel(): void {
    console.log('Cancel changes');
  }
}