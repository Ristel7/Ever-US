from utils.jwt_handler import generate_token, verify_token

token = generate_token("123456789")

print("Generated Token:\n")
print(token)

print("\n-------------------------\n")

decoded = verify_token(token)

print(decoded)
