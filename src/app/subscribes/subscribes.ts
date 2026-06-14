import productSubscribe from "../modules/product/product.subscribe";
import { startLdSyncCron } from "../modules/luxury-distribution/ld-sync.cron";
import { startDynamicCrons } from "../modules/dynamic-cron/dynamic-cron.service";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-08-27
 *
 * Class Subscribes
 */
class Subscribes {

  /**
   * Creating app Subscribes starts
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-27
   *
   * @returns {void}
   */
  public appSubscribes(): void {
    // Includes all subscribes
    productSubscribe.updateProductStock();
    startLdSyncCron();
    startDynamicCrons();
  }

  /**
   * Load subscribes
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-27
   *
   * @returns {void}
   */
  public subscribesConfig(): void {
    this.appSubscribes();
  }
}

export default Subscribes;
