class Message < ApplicationRecord
  after_update_commit :broadcast_general_business_changes

  validates :user_id, presence: true
  validates :content, presence: true
  validates :category, presence: true

  belongs_to :user

  broadcasts_to -> (message) {"messages"}, inserts_by: :append

  def clear_content
    self.content = ""
  end

  private

  def broadcast_general_business_changes
    if saved_change_to_general? || saved_change_to_business?
      broadcast_append_to "messages"
    end
  end

end
