class CreateChatSettings < ActiveRecord::Migration[7.0]
  def change
    create_table :chat_settings do |t|
      t.string :general
      t.string :business
      t.belongs_to :user, foreign_key: true, index: true

      t.timestamps
    end
  end
end
