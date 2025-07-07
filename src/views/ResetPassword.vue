<template>
    <div class="reset-password-outer">
        <div class="reset-password-card">
            <div class="reset-password-header">
                <h2>{{ $t('profile.resetPassword') }}</h2>
                <p>{{ $t('profile.resetPasswordDesc') }}</p>
            </div>

            <form @submit.prevent="resetPassword" class="reset-password-form">
                <!-- <div class="form-group">
                    <label for="email">{{ $t('profile.email') }}</label>
                    <input type="email" id="email" v-model="email" required readonly />
                </div> -->

                <div class="form-group password-group">
                    <label for="password">{{ $t('profile.newPassword') }}</label>
                    <div class="password-input-wrapper">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password" required
                            :placeholder="$t('profile.newPasswordPlaceholder')" />
                        <button type="button" class="toggle-password" @click="showPassword = !showPassword"
                            tabindex="-1">
                            <svg v-if="showPassword" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#667eea"
                                    stroke-width="2" />
                                <circle cx="12" cy="12" r="3" stroke="#667eea" stroke-width="2" />
                            </svg>
                            <svg v-else width="20" height="20" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.77 21.77 0 015.06-6.06M9.88 9.88A3 3 0 0112 9c1.66 0 3 1.34 3 3 0 .52-.13 1.01-.35 1.43"
                                    stroke="#667eea" stroke-width="2" />
                                <path d="M1 1l22 22" stroke="#667eea" stroke-width="2" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="form-group password-group">
                    <label for="password_confirmation">{{ $t('profile.confirmPassword') }}</label>
                    <div class="password-input-wrapper">
                        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="password_confirmation"
                            id="password_confirmation" required
                            :placeholder="$t('profile.confirmPasswordPlaceholder')" />
                        <button type="button" class="toggle-password"
                            @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                            <svg v-if="showConfirmPassword" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#667eea"
                                    stroke-width="2" />
                                <circle cx="12" cy="12" r="3" stroke="#667eea" stroke-width="2" />
                            </svg>
                            <svg v-else width="20" height="20" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.77 21.77 0 015.06-6.06M9.88 9.88A3 3 0 0112 9c1.66 0 3 1.34 3 3 0 .52-.13 1.01-.35 1.43"
                                    stroke="#667eea" stroke-width="2" />
                                <path d="M1 1l22 22" stroke="#667eea" stroke-width="2" />
                            </svg>
                        </button>
                    </div>
                </div>

                <button type="submit" :disabled="loading" class="submit-btn">
                    <span v-if="loading" class="loader-small"></span>
                    {{ loading ? $t('profile.loading') : $t('profile.submit') }}
                </button>

                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <div v-if="success" class="success-message">
                    {{ success }}
                </div>
            </form>

            <div class="back-to-profile">
                <button @click="goBackToProfile" class="back-btn">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                    {{ $t('profile.backToProfile') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Website/Header.vue';

export default {
    components: { Header },
    data() {
        return {
            email: '',
            password: '',
            password_confirmation: '',
            loading: false,
            error: null,
            success: null,
            showPassword: false,
            showConfirmPassword: false
        };
    },
    mounted() {
        // Try to get email from localStorage (adjust key as needed)
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const userObj = JSON.parse(user);
                this.email = userObj.email || '';
            } catch {
                this.email = localStorage.getItem('user_email') || '';
            }
        } else {
            this.email = localStorage.getItem('user_email') || '';
        }
    },
    methods: {
        async resetPassword() {
            this.error = null;
            this.success = null;

            if (this.password !== this.password_confirmation) {
                this.error = this.$t('profile.passwordsDoNotMatch');
                return;
            }

            if (this.password.length < 8) {
                this.error = this.$t('profile.passwordTooShort');
                return;
            }

            if (!this.email) {
                this.error = 'Email is required.';
                return;
            }
            this.loading = true;
            try {
                const response = await axios.post('api/reset-password', {
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.password_confirmation
                });

                if (response.data && response.data.status && response.data.token && response.data.user) {
                    localStorage.setItem('auth_token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    this.success = response.data.message || this.$t('profile.passwordResetSuccess');
                    this.password = '';
                    this.password_confirmation = '';
                    setTimeout(() => {
                        this.$router.push('/');
                    }, 2000);
                } else {
                    throw new Error(response.data?.message || 'Failed to reset password');
                }
            } catch (err) {
                this.error = err.response?.data?.message || this.$t('profile.passwordResetFailed');
            } finally {
                this.loading = false;
            }
        },
        goBackToProfile() {
            this.$router.push({ name: 'Profile' });
        }
    }
};
</script>

<style scoped>
.reset-password-outer {
    min-height: 100vh;
    background: linear-gradient(135deg, #9b9c9e 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
}

.reset-password-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.18);
    max-width: 400px;
    width: 100%;
    padding: 32px 28px 28px 28px;
    margin-top: 32px;
}

.reset-password-header {
    text-align: center;
    margin-bottom: 32px;
}

.reset-password-header h2 {
    margin: 0 0 8px 0;
    color: #2d3748;
    font-size: 1.8em;
    font-weight: 700;
    background: linear-gradient(135deg, #8f9092 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.reset-password-header p {
    margin: 0;
    color: #718096;
    font-size: 0.95em;
}

.reset-password-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    color: #4a5568;
    font-weight: 600;
    font-size: 0.95em;
}

.form-group input {
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1em;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
    color: #2d3748;
}

.form-group input:focus {
    outline: none;
    border-color: #727272;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: #fff;
}

.form-group input::placeholder {
    color: #a0aec0;
}

.submit-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 16px 24px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    margin-top: 8px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.loader-small {
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid #fff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-message {
    background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
    color: #c53030;
    padding: 14px 18px;
    border-radius: 12px;
    border: 1px solid #fc8181;
    font-size: 0.9em;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(197, 48, 48, 0.1);
}

.success-message {
    background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
    color: #22543d;
    padding: 14px 18px;
    border-radius: 12px;
    border: 1px solid #68d391;
    font-size: 0.9em;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(34, 84, 61, 0.1);
}

.back-to-profile {
    margin-top: 24px;
    text-align: center;
}

.back-btn {
    background: rgba(255, 255, 255, 0.9);
    color: #4a5568;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 18px;
    font-size: 0.9em;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-color: #667eea;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 600px) {
    .reset-password-outer {
        padding: 16px 0;
    }

    .reset-password-card {
        max-width: 100%;
        padding: 24px 16px 20px 16px;
        margin-top: 16px;
        border-radius: 16px;
    }

    .reset-password-header h2 {
        font-size: 1.5em;
    }

    .form-group input {
        padding: 12px 16px;
    }

    .submit-btn {
        padding: 14px 20px;
    }
}

@media (max-width: 400px) {
    .reset-password-card {
        padding: 20px 12px 16px 12px;
    }
}

.password-group .password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.toggle-password {
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    padding: 0;
    display: flex;
    align-items: center;
    color: #667eea;
}

.toggle-password svg {
    display: block;
}
</style>