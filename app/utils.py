from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    # Truncate password to 72 characters before hashing
    return pwd_context.hash(password[:72])

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Truncate again to ensure verification works
    return pwd_context.verify(plain_password[:72], hashed_password)


def calculate_wellness_score(sleep_hours: float, steps: int, calories: int, stress_level: int) -> float:
    score = 0.0
    
    if sleep_hours >= 7 and sleep_hours <= 9:
        score += 25
    elif sleep_hours >= 6 and sleep_hours < 7:
        score += 15
    elif sleep_hours > 9:
        score += 10
    else:
        score += 5
    
    if steps >= 10000:
        score += 25
    elif steps >= 7000:
        score += 20
    elif steps >= 5000:
        score += 15
    else:
        score += 5
    
    if calories >= 1800 and calories <= 2500:
        score += 25
    elif calories >= 1500 and calories < 1800:
        score += 15
    elif calories > 2500 and calories <= 3000:
        score += 15
    else:
        score += 5
    
    stress_score = max(0, 25 - (stress_level * 2.5))
    score += stress_score
    
    return min(100, max(0, score))

def generate_recommendations(sleep_hours: float, steps: int, calories: int, stress_level: int, wellness_score: float) -> list[str]:
    recommendations = []
    
    if sleep_hours < 7:
        recommendations.append(f"Try to get at least 7-9 hours of sleep. You're currently at {sleep_hours} hours.")
    elif sleep_hours > 9:
        recommendations.append(f"You might be oversleeping at {sleep_hours} hours. Aim for 7-9 hours.")
    
    if steps < 10000:
        recommendations.append(f"Aim for 10,000 steps daily. You're at {steps} steps. Try adding a {int((10000-steps)/2000)*10}-minute walk.")
    
    if calories < 1800:
        recommendations.append("Your calorie intake seems low. Make sure you're eating enough to maintain energy.")
    elif calories > 2500:
        recommendations.append("Consider moderating your calorie intake if weight management is a goal.")
    
    if stress_level > 6:
        recommendations.append(f"Your stress level is high ({stress_level}/10). Try meditation, deep breathing, or a relaxing activity.")
    
    if wellness_score < 50:
        recommendations.append("Your overall wellness score is below average. Focus on improving sleep, activity, and stress management.")
    elif wellness_score >= 75:
        recommendations.append("Great job! Your wellness score is excellent. Keep up the healthy habits!")
    
    return recommendations if recommendations else ["You're doing well! Keep maintaining your healthy lifestyle."]
