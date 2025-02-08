import Tag from "./tag.model";
import TagType from "./tag.type";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-08-01
 *
 * Class TagService
 */
class TagService {
  /**
   * Get tag details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {string} tagId the tag's id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getTagById(tagId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const tag = await Tag.findById(tagId);

          resolve(tag);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all products tags
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getTags(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const tags = await Tag.find().populate("products", "_id name");

          resolve(tags);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Get all showing tags details
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-08-15
   *
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public getShowingTag(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const tags = await Tag.find({ status: "show" }).sort({
            _id: -1,
          });

          resolve(tags);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create a tag
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {any} data the request body
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async store(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const tag: any = new Tag(data);
          const createdTag = await tag.save();

          resolve(createdTag);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Create many tags
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-08-15
   *
   * @param {RoleType} data the tags data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async storeMany(data: TagType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const createdTags = await Tag.insertMany(data);

          resolve(createdTags);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update a tag
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-08-15
   *
   * @param {string} tagId the tag id
   * @param {TagType} data the tag data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async update(
    tagId: string,
    data: TagType
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const tag = await Tag.findById(tagId);

          if (tag) {
            tag.name = { ...tag.name, ...data.name };
            tag.slug = { ...tag.slug, ...data.slug };
            tag.status = data.status;

            const updatedTag = await tag.save();

            resolve(updatedTag);
          } else {
            resolve(tag);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update tag status
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-07-14
   *
   * @param {string} tagId the tag id
   * @param {TagType} data the tag data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateStatus(
    tagId: string,
    data: TagType
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const tag = await Tag.findById(tagId);

          if (tag) {
            tag.status = data.status;

            const updatedTag = await tag.save();

            resolve(updatedTag);
          } else {
            resolve(tag);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Update many tags
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-08-15
   *
   * @param {TagType} data the tags data
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public async updateMany(data: TagType): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const updatedTags = await Tag.updateMany(
            { _id: { $in: data?.ids?.map((item) => item) } },
            {
              $set: {
                status: data.status,
              },
            },
            {
              multi: true,
            }
          );

          resolve(updatedTags);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  /**
   * Delete a tag by id
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-01
   *
   * @param {string} tagId the tag id
   * @return {Promise<unknown>} the eventual completion or failure
   */
  public delete(tagId: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const tag: any = await Tag.findById(tagId);

          if (tag) {
            const deletedTag = await tag.deleteOne();

            resolve(deletedTag);
          } else {
            resolve(tag);
          }
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

   /**
   * Delete many tags
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2024-08-15
   *
   * @param {Array<string>} data the tag ids
   * @return {Promise<unknown>} the eventual completion or failure
   */
   public deleteMany(data: Array<string>): Promise<unknown> {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const deleteTags = await Tag.deleteMany({
            _id: data.map((item) => item),
          });

          resolve(deleteTags);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }
}

const tagService = new TagService();
export default tagService;
