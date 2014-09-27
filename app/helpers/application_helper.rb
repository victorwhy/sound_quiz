module ApplicationHelper

  def create_frontend_quiz(artist, quiz_id)
    quiz = {}
    quiz[:artist] = artist.name
    quiz[:id] = artist.id
    quiz[:itunes_id] = artist.itunes_id

    artist.quizzes.find(quiz_id).questions.each_with_index do |question, array_index|
      human_index = (array_index + 1).to_s
      question_key = ("question_#{human_index}").to_sym
      quiz[question_key] = make_question_hash question
    end

    quiz
  end

  def make_question_hash question
    question_hash = {}
    question_hash[:db_id] = question.id
    question_hash[:player_url] = question.right_answer.preview_url
    question_hash[:choices] = [ question.right_answer ] + question.wrong_choices.map(&:track)
    question_hash[:choices] = question_hash[:choices].shuffle
    question_hash
  end

  def create_first_quiz_for artist
    artist.quizzes = [ Quiz.new(difficulty_level: 1) ]

     answer_tracks = artist.tracks.first(5)

     while artist.quizzes.first.questions.length < 5
       artist.quizzes.first.questions << Question.new(right_answer: answer_tracks.shift)
     end

     artist.quizzes.first.questions.each do |question|
       choices = artist.tracks.first(10)
       while question.wrong_choices.length < 3
         potential_wrong_answer = choices.pop
         if potential_wrong_answer != question.right_answer
           question.wrong_choices << WrongChoice.new(track: potential_wrong_answer )
         end
       end
     end

     artist.quizzes.first
  end


end
