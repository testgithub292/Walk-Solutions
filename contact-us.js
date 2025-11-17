        // DOM elements
        const contactForm = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const successToast = new bootstrap.Toast(document.getElementById('successMessage'));

        // Form submission handler
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                timestamp: new Date()
            };

            // Validate form
            if (!validateForm(formData)) {
                return;
            }

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            submitBtn.querySelector('.btn-loader').classList.remove('d-none');

            try {
                // Save to Firestore
                await db.collection('walksolutioncontacts').add(formData);
                
                // Show success toast
                successToast.show();
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                console.error('Error saving to Firestore:', error);
                showError('There was an error sending your message. Please try again.');
            } finally {
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'Send Message';
                submitBtn.querySelector('.btn-loader').classList.add('d-none');
            }
        });

        // Form validation
        function validateForm(formData) {
            let isValid = true;
            
            // Reset error messages
            clearErrors();
            
            // Name validation
            if (!formData.name) {
                showFieldError('nameError', 'Name is required');
                isValid = false;
            } else if (formData.name.length < 2) {
                showFieldError('nameError', 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formData.email) {
                showFieldError('emailError', 'Email is required');
                isValid = false;
            } else if (!emailRegex.test(formData.email)) {
                showFieldError('emailError', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Phone validation (optional but validate if provided)
            if (formData.phone && formData.phone.trim() !== '') {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
                    showFieldError('phoneError', 'Please enter a valid phone number');
                    isValid = false;
                }
            }
            
            // Subject validation
            if (!formData.subject) {
                showFieldError('subjectError', 'Subject is required');
                isValid = false;
            } else if (formData.subject.length < 5) {
                showFieldError('subjectError', 'Subject must be at least 5 characters');
                isValid = false;
            }
            
            // Message validation
            if (!formData.message) {
                showFieldError('messageError', 'Message is required');
                isValid = false;
            } else if (formData.message.length < 10) {
                showFieldError('messageError', 'Message must be at least 10 characters');
                isValid = false;
            }
            
            return isValid;
        }

        // Error handling functions
        function clearErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
            });
        }

        function showFieldError(elementId, message) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = message;
            }
        }

        function showError(message) {
            // Create Bootstrap alert
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
            alertDiv.style.zIndex = '1060';
            alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.body.appendChild(alertDiv);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 5000);
        }

        // Phone input change handler to clear error when valid
        document.getElementById('phone').addEventListener('input', function() {
            const phoneError = document.getElementById('phoneError');
            const phoneValue = this.value.trim();
            
            if (phoneValue === '') {
                phoneError.textContent = '';
            } else {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (phoneRegex.test(phoneValue.replace(/\s/g, ''))) {
                    phoneError.textContent = '';
                }
            }
        });

        // Initialize form on page load
        document.addEventListener('DOMContentLoaded', function() {
            console.log("ContactPro Form Loaded!");
            console.log("Firebase initialized:", firebase.apps.length > 0);
        });