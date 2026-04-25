import ast

numbers = ast.literal_eval(input("숫자 리스트를 입력하세요 (예: [5, 2, 8]): "))

max_value = max(numbers)
min_value = min(numbers)
avg_value = sum(numbers) / len(numbers)
sorted_numbers = sorted(numbers)
even_numbers = [n for n in numbers if n % 2 == 0]

print(f"최댓값: {max_value}")
print(f"최솟값: {min_value}")
print(f"평균값: {avg_value}")
print(f"정렬된 리스트: {sorted_numbers}")
print(f"짝수 리스트: {even_numbers}")
