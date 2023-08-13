class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.string :content
      t.string :category
      t.references :user, foreign_key: true, index: true

      t.timestamps
    end
  end
end
