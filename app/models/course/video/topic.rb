# frozen_string_literal: true
class Course::Video::Topic < ApplicationRecord
  acts_as_discussion_topic display_globally: true

  belongs_to :video, inverse_of: :topics

  after_initialize :set_course, if: :new_record?

  # Specific implementation of Course::Discussion::Topic#from_user, this is not supposed to be
  # called directly.
  scope :from_user, (lambda do |user_id|
    unscoped.
      joining { discussion_topic.posts }.
      where.has { discussion_topic.posts.creator_id.in(user_id) }.
      selecting { discussion_topic.id }
  end)

  private

  # Set the course as the same course of the lesson plan item.
  def set_course
    self.course ||= video.lesson_plan_item.course if video
  end
end
