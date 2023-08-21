class Message < ApplicationRecord
  validates :user_id, presence: true
  validates :content, presence: true
  validates :category, presence: true

  belongs_to :user

  broadcasts_to -> (message) {"messages"}, inserts_by: :append

  def clear_content
    self.content = ""
  end

end
