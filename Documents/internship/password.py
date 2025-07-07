import re

def check_password_strength(password):
    score = 0
    feedback = []

    # Criteria
    length_criteria = len(password) >= 8
    upper_criteria = bool(re.search(r"[A-Z]", password))
    lower_criteria = bool(re.search(r"[a-z]", password))
    digit_criteria = bool(re.search(r"\d", password))
    special_criteria = bool(re.search(r"[!@#$%^&*(),.?\":{}|<>]", password))

    # Scoring
    if length_criteria:
        score += 1
    else:
        feedback.append("Password should be at least 8 characters long.")

    if upper_criteria:
        score += 1
    else:
        feedback.append("Add at least one uppercase letter.")

    if lower_criteria:
        score += 1
    else:
        feedback.append("Add at least one lowercase letter.")

    if digit_criteria:
        score += 1
    else:
        feedback.append("Add at least one digit.")

    if special_criteria:
        score += 1
    else:
        feedback.append("Include at least one special character (e.g. !, @, #, $).")

    # Strength Description
    if score == 5:
        strength = "Very Strong 💪"
    elif score == 4:
        strength = "Strong ✅"
    elif score == 3:
        strength = "Moderate ⚠️"
    elif score == 2:
        strength = "Weak ❗"
    else:
        strength = "Very Weak ❌"

    return {
        "score": score,
        "strength": strength,
        "feedback": feedback
    }

# Example usage
if __name__ == "__main__":
    user_password = input("Enter your password to check its strength: ")
    result = check_password_strength(user_password)

    print("\nPassword Strength:", result["strength"])
    print("Score:", result["score"], "/ 5")
    if result["feedback"]:
        print("Suggestions to improve your password:")
        for item in result["feedback"]:
            print("- " + item)
