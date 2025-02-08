/**
 * Check ObjectId validity
 *
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-04-10
 *
 * @param {string} id the object id
 * @returns {RegExpMatchArray | nul} true | false
 */
export function checkObjectId(id: string): RegExpMatchArray | null {
  return id.match(/^[0-9a-fA-F]{24}$/);
}

/**
 * Omit specific properties from an object
 *
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-09-02
 *
 * @param {strign} str the string to slugify
 * @returns {any} of the object without exclude properties
 */
export function slugify(str: string): string {
  return (
    String(str)
      // split accented characters into their base characters
      // and diacritical marks
      .normalize("NFKD")
      // remove all the accents, which happen to be all in
      // the \u03xx UNICODE block.
      .replace(/[\u0300-\u036f]/g, "")
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-")
  ); // remove consecutive hyphens
}
