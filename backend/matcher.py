import sqlite3
from nltk.tokenize import word_tokenize
from nltk.corpus import wordnet
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

DB_PATH = 'database.db'
MATCH_THRESHOLD = 0.7

class WordNetMatcher:
    def __init__(self):
        self.credits = 5
        self.conn = sqlite3.connect(DB_PATH)
        self.cursor = self.conn.cursor()

    def get_synonyms(self, word):
        synonyms = set()
        for syn in wordnet.synsets(word):
            for lemma in syn.lemmas():
                synonyms.add(lemma.name())
        return synonyms

    def preprocess(self, text):
        words = word_tokenize(text.lower())
        expanded_words = []
        for word in words:
            expanded_words.append(word)
            expanded_words.extend(self.get_synonyms(word))
        return ' '.join(expanded_words)

    def load_documents_from_db(self):
        self.cursor.execute("SELECT filepath, content FROM documents")
        rows = self.cursor.fetchall()
        filenames = [row[0] for row in rows]
        contents = [row[1] for row in rows]
        return contents, filenames

    def match_document(self, uploaded_text, docs, filenames):
        processed_docs = [self.preprocess(doc) for doc in docs]
        processed_uploaded = self.preprocess(uploaded_text)

        vectorizer = TfidfVectorizer()
        tfidf = vectorizer.fit_transform(processed_docs + [processed_uploaded])
        similarity_scores = cosine_similarity(tfidf[-1], tfidf[:-1]).flatten()

        for i, score in enumerate(similarity_scores):
            if score >= MATCH_THRESHOLD:
                return {
                    "matched_file": filenames[i],
                    "match_percentage": round(score * 100, 2),
                    "matched_content": docs[i]
                }

        return {
            "matched_file": None,
            "match_percentage": 0.0,
            "matched_content": None
        }

    def run(self):
        uploaded_text = input("Enter your text: ").strip()

        if not uploaded_text:
            return {
                "matched_file": None,
                "match_percentage": 0.0,
                "matched_content": None
            }

        docs, filenames = self.load_documents_from_db()

        if not docs:
            return {
                "matched_file": None,
                "match_percentage": 0.0,
                "matched_content": None
            }

        result = self.match_document(uploaded_text, docs, filenames)
        self.conn.close()
        return result

if __name__ == '__main__':
    matcher = WordNetMatcher()
    result = matcher.run()
    print(result)
