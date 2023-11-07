import openai
import os
import sys
from pathlib import Path

openai.api_key = os.environ.get("OPEN_AI_API_KEY")


def get_chat_gpt_hints(clues_per_word, words):
    query = f"Give me {clues_per_word} interesting and difficult crossword clues for each of the following words:\n"
    query += "".join([f"- {word}\n" for word in words])
    query += "\n"
    query += "Each clue should be a sentence.\n"
    query += "\n"
    query += "Format your response as follows:\n"
    query += "Word:\n"
    query += "- Clue 1\n"
    query += "- Clue 2\n"
    query += "- Clue 3"

    messages = [{"role": "system", "content": "You are an intelligent assistant."},
                {"role": "user", "content": query}]
    while True:
        try:
            chat = openai.ChatCompletion.create(
                model="gpt-3.5-turbo", messages=messages
            )
            return chat.choices[0].message.content
        except:
            print("\t! ChatGPT encountered an error: trying again...")


def main():
    raw_words_file_path = Path(sys.argv[1])
    cwd = raw_words_file_path.cwd()
    clues_per_word = int(sys.argv[2])
    initial_index = int(sys.argv[3])
    bucket_size = int(sys.argv[4])

    print("Reading raw words file...")
    raw_words = raw_words_file_path.read_text()

    print("Parsing raw words...")
    words = list({word.lower() for word in raw_words.split() if len(word) > 3 and word.isalpha()})
    words.sort()

    print("Writing parsed words to file...")
    with open(f"{cwd}/words.txt", "w") as words_file:
        words_file.write("\n".join(words))

    print("Fetching raw hints from ChatGPT:")
    for index in range(initial_index, len(words), bucket_size):
        print(f"\t• Fetching hints for words {index} to {index + bucket_size - 1}...")
        raw_hints = get_chat_gpt_hints(clues_per_word, words[index:index + bucket_size])
        raw_hints_file_name = f"raw_hints_{index}-{index + bucket_size - 1}.txt"
        print(f"\t✓ Writing hints to {raw_hints_file_name}")
        with open(f"{cwd}/raw_hints/{raw_hints_file_name}", "w") as raw_hints_file:
            raw_hints_file.write(raw_hints)


if __name__ == "__main__":
    main()
