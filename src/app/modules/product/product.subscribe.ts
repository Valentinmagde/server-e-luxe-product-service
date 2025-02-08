import DBManager from "../../../core/db";
import rabbitmqManager from "../../../core/rabbitmq";
import productService from "./product.service";

/**
 * @author Valentin Magde <valentinmagde@gmail.com>
 * @since 2023-08-27
 *
 * Class ProductSubscribe
 */
class ProductSubscribe {
  /**
   * Update product stock
   *
   * @author Valentin Magde <valentinmagde@gmail.com>
   * @since 2023-08-27
   *
   * @return {Promise<void>} the eventual completion or failure
   */
  public async updateProductStock(): Promise<void> {
    try {
      const dbManager = new DBManager();

      const exchangeName = "eluxe.order.updateProductStock";
      const routingKey = "updateProductStock";
      const queueName = "updateProductStockQueue";

      await rabbitmqManager.createChannel();
      const channel = rabbitmqManager.channel;
      await channel.assertExchange(exchangeName, "direct");
      const q = await channel.assertQueue(queueName);
      await channel.bindQueue(q.queue, exchangeName, routingKey);

      channel.consume(q.queue, (msg: any) => {
        const data: any = JSON.parse(msg.content);

        data.message.productItems.forEach((e: any) => {
          dbManager
            .asyncOnConnect()
            .then((dbConenction) => {
              productService
                .showProductById(e._id)
                .then((result: any) => {
                  if (result !== null && result !== undefined) {
                    productService
                      .patch(result._id, [
                        {
                          op: "replace",
                          path: "/current_stock",
                          value: result.current_stock - e.qty,
                        },
                      ])
                      .then((product) => {
                        console.log(product);
                      })
                      .catch((error) => {
                        console.log(error);
                        dbConenction.disconnect();
                      });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  dbConenction.disconnect();
                });
            })
            .catch((err) => {
              console.log(err);
            });
        });

        channel.ack(msg);
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const productSubscribe = new ProductSubscribe();
export default productSubscribe;
