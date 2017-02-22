json.(answer, :id, :question_id, :text_response)
json.(answer.question, :question_type, :weight, :required, :max_options, :min_options)
json.options do
  json.array! answer.options, partial: 'option', as: :option
end